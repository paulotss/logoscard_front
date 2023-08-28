import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Dialog, DialogActions, Button, DialogTitle } from "@mui/material";
import axios from "../http";
import Header from "../components/Header";
import loading from "../media/isLoading.gif";
import InvoicesList from "../components/InvoicesList";
import PlanLink from "../components/Plan/PlanLink";
import Card from "../components/Card";
import InputEdit from "../components/EditElements/InputEdit";
import DateEdit from "../components/EditElements/DateEdit";

const ClientPage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [removed, setRemoved] = useState();
  const [open, setOpen] = useState({status: false, payload: {}});
  const { id } = useParams();

  const handleClickRemove = async () => {
    try {
      const result = await axios.delete(`/assignment/${open.payload.assignmentId}`);
      setRemoved(result.data)
      setOpen({...open, status: false});
    } catch (error) {
      console.log(error);
    }
  }

  const formatDate = (value) => {
    const date = new Date(value);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const result = await axios.get(`/user/${id}`);
      setUser(result.data);
      setIsLoading(false);
    }
    getUser();
  }, [id, removed]);

  return (
    <>
      {
        isLoading
        ? <div className="flex justify-center w-full mt-5">
            <img src={ loading } alt="" />
          </div>
        : <>
          <Header name={user.firstName} />
          <main className="p-5">
            <p className="font-bold mb-3">Cliente</p>
            <section className="flex flex-wrap border-b-2 border-gray-400 pb-5 mb-5">
              <InputEdit
                title="Nome"
                valueInput={user.firstName}
                entity="firstName"
                userId={user.id}
              />
              <InputEdit
                title="Sobrenome"
                valueInput={user.lastName}
                entity="lastName"
                userId={user.id}
              />
              <InputEdit
                title="Email"
                valueInput={user.email}
                entity="email"
                userId={user.id}
              />
              <InputEdit
                title="RG"
                valueInput={user.rg}
                entity="rg"
                userId={user.id}
              />
              <InputEdit
                title="CPF"
                valueInput={user.cpf}
                entity="cpf"
                userId={user.id}
              />
              <InputEdit
                title="Celular"
                valueInput={user.cellPhone}
                entity="cellPhone"
                userId={user.id}
              />
              <DateEdit
                title="Nascimento"
                valueInput={formatDate(user.birthday)}
                entity="birthday"
                userId={user.id}
              />
            </section>
            <p className="font-bold mb-3">Plano</p>
            <section className="border-b-2 border-gray-400 pb-5 mb-5">
              {
                user.assignment
                ? <>
                    <PlanLink
                      assignmentId={user.assignment.id}
                      assignmentTitle={user.assignment.plan.title}
                      userId={user.id}
                    />
                    <p className="mt-5 text-sm">Dependentes</p>
                      { user.assignment.dependents.map(d => (
                        <div
                          key={d.id}
                          className="font-bold bg-gray-400 p-2 rounded-md mb-2 w-80 flex justify-between"
                        >
                          <Link to={`/dependent/${d.id}`}>
                            { `${d.user.firstName} ${d.user.lastName}` }
                          </Link>
                      </div>
                      )) }
                    </>
                  : <div className="mt-2">
                      <Link
                        to={`/plan/add/${user.id}`}
                        className="bg-green-900 p-2 w-40 text-center rounded-md text-white"
                      >
                        Adicionar Plano
                      </Link>
                    </div>
                }
            </section>
            <section className="flex justify-between">
              <div className="mt-2">
                <Card client={user} />
              </div>
            </section>
            {user.invoices && user.invoices.length > 0 && <InvoicesList invoices={user.invoices} />}
            <Dialog
              open={open.status}
              onClose={() => { setOpen({...open, status: false}) }}
              aria-labelledby="alert-delete"
            >
              <DialogTitle id="alert-delete">
                {"Tem certeza que deseja remover este plano?"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleClickRemove}>Confirmar</Button>
                <Button onClick={() => { setOpen({...open, status: false}) }}>Cancelar</Button>
              </DialogActions>
            </Dialog>
          </main>
          </>
      }
      
    </>
  )
}

export default ClientPage;
