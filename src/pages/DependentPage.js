import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
import loading from "../media/isLoading.gif";
import PlanDependentLink from "../components/Plan/PlanDependentLink";

const DependentPage = () => {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ dependent, setDependent ] = useState({});
  const [ client, setClient ] = useState({});
  const { id } = useParams();

  const formatDate = (value) => {
    const date = new Date(value);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const getDependent = async () => {
      setIsLoading(true);
      const result = await axios.get(`/dependent/${id}`);
      setDependent(result.data);
      const getClient = await axios.get(`/user/${result.data.assignments.userId}`);
      setClient(getClient.data);
      setIsLoading(false);
    }
    getDependent();
  }, [id]);

  return (
    <>
      {
        isLoading
        ? <div className="flex justify-center w-full mt-5">
            <img src={ loading } alt="" />
          </div>
        : <>
            <Header />
            <main className="p-5">
              <p className="font-bold mb-3">Dependente</p>
              <section className="flex justify-between border-b-2 border-gray-400 pb-5">
                <div>
                  <p>Inscrição</p>
                  <p className="font-bold text-4xl">00{dependent.id}</p>
                </div>
              </section>
              <section>
                <p className="mt-5 text-sm">Titular</p>
                <Link
                  to={`/client/${client.id}`}
                  className="font-bold bg-gray-400 p-1 rounded-md mb-2 w-80"
                >
                  {`${client.firstName} ${client.lastName}`}
                </Link>
                <p className="mt-5 text-sm">Nome</p>
                <p>{`${dependent.user.firstName} ${dependent.user.lastName}`}</p>
                <p className="mt-5 text-sm">Email</p>
                <p>{dependent.user.email}</p>
                <p className="mt-5 text-sm">RG</p>
                <p>{dependent.user.rg}</p>
                <p className="mt-5 text-sm">CPF</p>
                <p>{dependent.user.cpf}</p>
                <p className="mt-5 text-sm">Celular</p>
                <p>{dependent.user.cellPhone}</p>
                <p className="mt-5 text-sm">Nascimento</p>
                <p>{formatDate(dependent.user.birthday)}</p>
                <p className="mt-5 text-sm">Plano</p>
                <PlanDependentLink
                  assignmentId={dependent.assignments.id}
                  assignmentTitle={dependent.assignments.plan.title}
                />
              </section>
            </main>
          </>
      }
    </>
  )
}

export default DependentPage;
