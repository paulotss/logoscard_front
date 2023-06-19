import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
import loading from "../media/isLoading.gif";

const ClientPage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const result = await axios.get(`/user/${id}`);
      setUser(result.data);
      setIsLoading(false);
    }
    getUser();
  }, [id]);

  return (
    <>
      <Header />
      {
        isLoading
        ? <div className="flex justify-center w-full mt-5">
            <img src={ loading } alt="" />
          </div>
        : <main className="p-5">
            <p className="font-bold mb-3">Cliente</p>
            <section className="flex justify-between border-b-2 border-gray-400 pb-5">
              <div>
                <p>Inscrição</p>
                <p className="font-bold text-4xl">00{user.id}</p>
              </div>
              <div className="w-24 h-24 bg-gray-900 rounded-full">
                {}
              </div>
            </section>
            <section>
              <p className="mt-5">Nome</p>
              <p>{`${user.firstName} ${user.lastName}`}</p>
              <p className="mt-5">Email</p>
              <p>{user.email}</p>
              <p className="mt-5">CPF</p>
              <p>{user.cpf}</p>
              <p className="mt-5">Planos</p>
                {
                  user.plans.map((plan) => (
                    <p key={plan.id} className="font-bold">
                      {plan.title.toUpperCase()}
                    </p>
                  ))
                }
              <button
                type="button"
                className="bg-green-900 p-2 rounded-full text-white mt-5"
              >
                Adicionar Plano
              </button>
            </section>
          </main>
      }
      
    </>
  )
}

export default ClientPage;
