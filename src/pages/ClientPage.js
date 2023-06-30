import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Dialog, DialogActions, Button, DialogTitle } from "@mui/material";
import axios from "../http";
import Header from "../components/Header";

import loading from "../media/isLoading.gif";
import InvoicesList from "../components/InvoicesList";
import { HiArchiveBoxXMark } from 'react-icons/hi2';
import AddPlan from "../components/AddPlan";

const ClientPage = () => {
  const AWS_BUCKET = process.env.REACT_APP_AWS_BUCKET;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [removed, setRemoved] = useState();
  const [isShowingAddPlans, setIsShowingAddPlans] = useState(false);
  const [open, setOpen] = useState({status: false, payload: {}});
  const { id } = useParams();
  const [actPlan, setActPlan] = useState({
    planId: "1",
    expiration: "10",
    parcels: "1",
    price: 300,
  });

  const handleClickRemove = async () => {
    try {
      const result = await axios.delete(`/assignment/${open.payload.assignmentId}`);
      setRemoved(result.data)
      setOpen({...open, status: false});
    } catch (error) {
      console.log(error);
    }
  }

  const getExpirationDay = () => {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear() + 1
    return `${year}/${month}/${day}`;
  }

  const getPlanBenefits = (payload) => {
    const { benefits } = payload.assignment.plan;
    const result = benefits.map((benefit) => ({
      amount: benefit.amount && 0,
      benefitId: benefit.id,
      assignmentId: payload.assignment.id,
    }));
    return result;
  }

  const submitPlanForm = async () => {
    setIsLoading(true);
    try {
      const newUser = await axios.post('/assignment', {
        planId: actPlan.planId,
        userId: user.id,
        expiration: getExpirationDay(),
      });
      await axios.post('/invoices', {
        parcels: actPlan.parcels,
        day: actPlan.expiration,
        userId: user.id,
        totalPrice: actPlan.price,
      });
      await axios.post('/assignment/benefit', getPlanBenefits(newUser.data));
    } catch (error) {
      console.log(error);
    }
    setIsShowingAddPlans(false);
    setIsLoading(false);
  }

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const result = await axios.get(`/user/${id}`);
      setUser(result.data);
      setIsLoading(false);
    }
    getUser();
  }, [id, isShowingAddPlans, removed]);

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
              <p className="mt-5 text-sm">Plano</p>
                {
                  user.assignment
                  ? <div
                      key={user.assignment.id}
                      className="font-bold bg-gray-400 p-1 rounded-md mb-2 w-80 flex justify-between"
                    >
                      <Link to={`/client/benefit/${user.id}`}>
                        {user.assignment.plan.title.toUpperCase()}
                      </Link>
                      <button
                        type="button"
                        className="pt-1 pr-2 text-red-900"
                        onClick={() => { setOpen({
                          payload: {
                            assignmentId: user.assignment.id,
                          },
                            status: true
                          })
                        }}
                      >
                        <HiArchiveBoxXMark />
                      </button>
                    </div>
                  : isShowingAddPlans
                    ? <AddPlan
                        submitPlanForm={submitPlanForm}
                        setIsShowingAddPlans={setIsShowingAddPlans}
                        setActPlan={setActPlan}
                        actPlan={actPlan}
                      />
                    : <button
                        type="button"
                        onClick={() => { setIsShowingAddPlans(true) }}
                        className="bg-green-900 p-2 w-40 text-center rounded-full text-white mt-2"
                      >
                        Adicionar Plano
                      </button>
                }
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
      }
      
    </>
  )
}

export default ClientPage;
