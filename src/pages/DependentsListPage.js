import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from "../http";
import loading from "../media/isLoading.gif";
import { Link } from 'react-router-dom';

const DependentsListPage = () => {
  const [dependents, setDependents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      const result = await axios.get('/dependents');
      setDependents(result.data);
      setIsLoading(false);
    }
    getUsers();
  }, [])
  return (
    <>
      <Header />
      <main className="p-5">
        <p className="font-bold mb-3">Dependentes</p>
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
              : dependents.map((d) => (
                  <Link to={`/dependent/${d.id}`}
                    key={ d.id }
                    className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                  >
                    <div>{ d.id }</div>
                    <div className="col-span-2">{ `${d.user.firstName} ${d.user.lastName}` }</div>
                    <div className="text-right pr-2">
                      { d.user.assignment
                        ? <div className="w-3 h-3 bg-green-900 rounded-full inline-block"> </div> 
                        : <div className="w-3 h-3 bg-yellow-600 rounded-full inline-block"> </div>
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

export default DependentsListPage;
