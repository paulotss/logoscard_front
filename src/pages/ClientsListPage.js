import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from "../http";
import loading from "../media/isLoading.gif";

const ClientsListPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      const result = await axios.get('/users');
      setUsers(result.data);
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
              : users.map((user) => (
                  <div
                    key={ user.id }
                    className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                  >
                    <div>{ user.id }</div>
                    <div className="col-span-2">{ `${user.firstName} ${user.lastName}` }</div>
                    <div className="text-right pr-2">
                      { user.plans.every((plan) => (
                          new Date(plan.UserPlanModel.createdAt) < new Date()
                        )) ? <div className="w-3 h-3 bg-green-900 rounded-full inline-block"> </div> 
                           : <div className="w-3 h-3 bg-red-900 rounded-full inline-block"> </div> 
                      }
                    </div>
                  </div>
                ))
          }
        </div>
      </main>
    </>
  )
}

export default ClientsListPage;
