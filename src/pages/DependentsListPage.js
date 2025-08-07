import { useState, useEffect } from 'react';
import Header from "../components/Header";
import axios from "../http";
import loading from "../media/isLoading.gif";
import { Link } from 'react-router-dom';

const DependentsListPage = () => {
  const [dependents, setDependents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatId = (id) => {
    let result = id.toString();
    if (result.length < 3) {
      let zeros = 3 - result.length;
      while (zeros > 0) {
        result = "0" + result;
        zeros -= 1;
      }
    }
    return result;
  }
  
  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      const result = await axios.get('/api/dependents/dependents');
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
          <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
            <div>Inscrição</div>
            <div className="col-span-2">Nome</div>
          </div>
          {
            isLoading
              ? <div className="flex justify-center w-full">
                  <img src={ loading } alt="" />
                </div>
              : dependents.map((d) => (
                  <Link to={`/dependent/${d.id}`}
                    key={ d.id }
                    className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                  >
                    <div>{ formatId(d.user.id) }</div>
                    <div className="col-span-2">{ `${d.user.firstName} ${d.user.lastName}` }</div>
                  </Link>
                ))
          }
        </div>
      </main>
    </>
  )
}

export default DependentsListPage;
