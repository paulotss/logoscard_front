import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
import loading from "../media/isLoading.gif";
import PlanDependentLink from "../components/Plan/PlanDependentLink";
import InputEdit from "../components/EditElements/InputEdit";
import DateEdit from "../components/EditElements/DateEdit";
import Card from "../components/Card";

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
      const result = await axios.get(`'/api/dependents/dependent/${id}`);
      setDependent(result.data);
      const getClient = await axios.get(`/api/users/user/${result.data.assignments.userId}`);
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
              <section className="flex flex-wrap border-b-2 border-gray-400 pb-5 mb-5">
                <div className="p-2 border min-w-[256px] rounded-md mr-2 mb-2">
                  <p className="text-sm">Titular</p>
                  <div>
                    <Link
                      to={`/client/${client.id}`}
                    >
                      <div
                        className="font-bold bg-gray-400 p-2 rounded-md w-full"
                      >
                        {`${client.firstName} ${client.lastName}`}
                      </div>
                    </Link>
                  </div>
                </div>
                <InputEdit
                  title="Nome"
                  entity="firstName"
                  valueInput={dependent.user.firstName}
                  userId={dependent.user.id}
                />
                <InputEdit
                  title="Sobrenome"
                  entity="lastName"
                  valueInput={dependent.user.lastName}
                  userId={dependent.user.id}
                />
                <InputEdit
                  title="Email"
                  entity="email"
                  valueInput={dependent.user.email}
                  userId={dependent.user.id}
                />
                <InputEdit
                  title="RG"
                  entity="rg"
                  valueInput={dependent.user.rg}
                  userId={dependent.user.id}
                />
                <InputEdit
                  title="CPF"
                  entity="cpf"
                  valueInput={dependent.user.cpf}
                  userId={dependent.user.id}
                />
                <InputEdit
                  title="Celular"
                  entity="cellPhone"
                  valueInput={dependent.user.cellPhone}
                  userId={dependent.user.id}
                />
                <DateEdit
                  title="Nascimento"
                  entity="birthday"
                  valueInput={formatDate(dependent.user.birthday)}
                  userId={dependent.user.id}
                />
                <div className="p-2 border min-w-[256px] rounded-md">
                  <p className="text-sm">Plano</p>
                  <PlanDependentLink
                    assignmentId={dependent.assignments.id}
                    assignmentTitle={dependent.assignments.plan.title}
                  />
                </div>
              </section>
              <p className="font-bold mb-3">Cartão</p>
              <section>
                <div className="mt-2">
                  <Card
                    clientId={dependent.user.id}
                    expiration={formatDate(dependent.assignments.expiration)}
                  />
                </div>
              </section>
            </main>
          </>
      }
    </>
  )
}

export default DependentPage;
