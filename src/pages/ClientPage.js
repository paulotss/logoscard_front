import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogActions, Button, DialogTitle } from "@mui/material";
import axios from "../http";
import Header from "../components/Header";

import loading from "../media/isLoading.gif";
import InvoicesList from "../components/InvoicesList";
import { HiArchiveBoxXMark } from 'react-icons/hi2';

const ClientPage = () => {
  const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState({status: false, payload: {}});
  const { id } = useParams();

  const handleClickRemove = async () => {
    try {
      const result = await axios.delete('/plan', {
        data: {
          userId: open.payload.userId,
          planId: open.payload.planId
        }
      });
      setUser(result.data);
      setOpen({...open, status: false});
    } catch (error) {
      console.log(error);
    }
  }

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
              <p>{user.cellPhone}</p>
              <p className="mt-5 text-sm">Planos</p>
                {
                  user.plans.length > 0
                  ? user.plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="font-bold bg-gray-400 p-1 rounded-md mb-2 w-80 flex justify-between"
                      >
                        <div>{plan.title.toUpperCase()}</div>
                        <button
                          type="button"
                          className="pt-1 pr-2 text-red-900"
                          onClick={() => { setOpen({
                              payload: {
                                userId: plan.UserPlanModel.user_id,
                                planId: plan.UserPlanModel.plan_id
                              },
                              status: true
                            })
                          }}
                        >
                          <HiArchiveBoxXMark />
                        </button>
                      </div>
                    ))
                  : <p className="italic">Nenhum</p>
                }
              <button
                type="button"
                className="bg-green-900 p-2 rounded-full text-white mt-5"
              >
                Adicionar Plano
              </button>
            </section>
            {user.invoices.length > 0 && <InvoicesList invoices={user.invoices} />}
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
      }
      
    </>
  )
}

export default ClientPage;
