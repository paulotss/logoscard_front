import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
import loading from "../media/isLoading.gif";
import InvoicesList from "../components/InvoicesList";

const ClientPage = () => {
  const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
              <div className="w-32 h-32 bg-gray-900 rounded-full">
                <img
                  className="object-cover rounded-full"
                  src={AWS_BUCKET + user.photo}
                  alt=""
                />
              </div>
            </section>
            <section>
              <p className="mt-5 text-sm">Nome</p>
              <p>{`${user.firstName} ${user.lastName}`}</p>
              <p className="mt-5 text-sm">Email</p>
              <p>{user.email}</p>
              <p className="mt-5 text-sm">RG</p>
              <p>{user.rg}</p>
              <p className="mt-5 text-sm">CPF</p>
              <p>{user.cpf}</p>
              <p className="mt-5 text-sm">Celular</p>
              <p>({user.phone.area}) {user.phone.number}</p>
              <p className="mt-5 text-sm">Planos</p>
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
            {user.invoices.length > 0 && <InvoicesList invoices={user.invoices} />}
          </main>
      }
      
    </>
  )
}

export default ClientPage;
