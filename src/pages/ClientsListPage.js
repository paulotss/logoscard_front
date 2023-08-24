import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from "../http";
import loading from "../media/isLoading.gif";
import { Link } from 'react-router-dom';

const ClientsListPage = () => {
  const [clients, setClients] = useState([]);
  const [filterClients, setFilterClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const extractNameDependents = (dependents) => {
    const result = dependents.reduce((acc, dependent) => (
      acc += `${dependent.user.firstName} ${dependent.user.lastName}`.toLowerCase()
    ), "");
    return result;
  }

  const handleChangeSearchBar = ({ target }) => {
    const { value } = target;
    const result = clients.filter((client) => {
      const { firstName, lastName } = client.user;
      const fullNameClient = `${firstName} ${lastName}`.toLowerCase();
      const fullNamesDependents = extractNameDependents(client.user.assignment.dependents);
      const term = value.toLowerCase();
      return fullNameClient.includes(term) || fullNamesDependents.includes(term);
    });
    setSearchTerm(target.value);
    setFilterClients(result);
  }

  const checkLateInvoice = (invoices) => {
    const today = new Date();
    const late = invoices.some((invoice) => (
      new Date(invoice.expiration) < today && !invoice.paid
    ));
    return late;
  }

  const checkPendingInvoice = (invoices) => {
    const pending = invoices.some((invoice) => !invoice.paid);
    return pending;
  }
  
  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      const result = await axios.get('/clients');
      setClients(result.data);
      setFilterClients(result.data);
      setIsLoading(false);
    }
    getUsers();
  }, [])
  return (
    <>
      <Header />
      <main className="p-5">
        <p className="font-bold mb-3">Clientes</p>
        <div className="mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChangeSearchBar}
            className="w-full p-2 rounded-md"
          />
        </div>
        <div className="w-full">
          <div className="grid grid-gap grid-cols-4 grid-rows-1 p-2 text-sm">
            <div>Inscrição</div>
            <div className="col-span-2">Nome</div>
            <div className="text-right">Status</div>
          </div>
          {
            isLoading
              ? <div className="flex justify-center w-full">
                  <img src={ loading } alt="" />
                </div>
              : filterClients.map((client) => (
                  <>
                    <Link to={`/client/${client.user.id}`}
                      key={ client.id }
                      className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2 mt-2"
                    >
                      <div>{ client.id }</div>
                      <div className="col-span-2">{ `${client.user.firstName} ${client.user.lastName}` }</div>
                      <div className="text-right pr-2">
                        { !client.user.assignment
                          ? <div className="w-3 h-3 bg-slate-700 rounded-full inline-block"> </div> 
                          : checkLateInvoice(client.user.invoices)
                            ? <div className="w-3 h-3 bg-red-700 rounded-full inline-block"> </div>
                            : checkPendingInvoice(client.user.invoices)
                              ? <div className="w-3 h-3 bg-amber-500 rounded-full inline-block"> </div>
                              : <div className="w-3 h-3 bg-green-700 rounded-full inline-block"> </div>
                        }
                      </div>
                    </Link>
                    {
                      client.user.assignment &&
                      client.user.assignment.dependents.map((dependent) => (
                        <Link to={`/dependent/${dependent.id}`}
                          key={ dependent.id }
                          className="grid grid-gap grid-cols-4 grid-rows-1 bg-green-200 p-2 mb-2"
                        >
                          <div>{ dependent.id }</div>
                          <div className="col-span-2">{ `${dependent.user.firstName} ${dependent.user.lastName}` }</div>
                          <div> </div>
                        </Link>
                      ))
                    }
                  </>
                ))
          }
        </div>
      </main>
    </>
  )
}

export default ClientsListPage;
