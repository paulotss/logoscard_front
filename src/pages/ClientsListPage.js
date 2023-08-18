import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from "../http";
import loading from "../media/isLoading.gif";
import { Link } from 'react-router-dom';

const ClientsListPage = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.log(result.data);
      setClients(result.data);
      setIsLoading(false);
    }
    getUsers();
  }, [])
  return (
    <>
      <Header />
      <main className="p-5">
        <p className="font-bold mb-3">Clientes</p>
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
              : clients.map((client) => (
                  <Link to={`/client/${client.user.id}`}
                    key={ client.id }
                    className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
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
                ))
          }
        </div>
      </main>
    </>
  )
}

export default ClientsListPage;
