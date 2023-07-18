import { useState } from "react";
import axios from "../http";
import loading from "../media/isLoading.gif";

const AddPlan = ({ user, setUser }) => {
  const [ isShowing, setIsShowing ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ plans, setPlans ] = useState(null);
  const [ activePlan, setActivePlan ] = useState({
    expiration: "",
    parcels: 1,
  });
  
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
    console.log(activePlan.id);
    try {
      const newUser = await axios.post('/assignment', {
        planId: activePlan.id,
        userId: user.id,
        expiration: getExpirationDay(),
      });
      await axios.post('/invoices', {
        parcels: activePlan.parcels,
        day: activePlan.expiration,
        userId: user.id,
        totalPrice: activePlan.price,
      });
      await axios.post('/assignment/benefit', getPlanBenefits(newUser.data));
      const result = await axios.get(`/user/${user.id}`);
      setUser(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const handleAddPlanButton = async () => {
    setIsLoading(true);
    setIsShowing(true);
      try {
        const result = await axios.get('/plans');
        setPlans(result.data);
        setActivePlan({ ...activePlan, ...result.data[0]});
      } catch (error) {
        console.log(error);
      }
    setIsLoading(false);
  }

  const getPriceById = (planId) => {
    const plan = plans.find((plan) => plan.id === Number(planId));
    return plan.price;
  }

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "planId") {
      setActivePlan({
        ...activePlan,
        [name]: value,
        price: getPriceById(value)
      });
    } else {
      setActivePlan({
        ...activePlan,
        [name]: value,
      });
    }
  }

  if (!isShowing) {
    return (
      <button
        type="button"
        className="bg-green-900 p-2 w-40 text-center rounded-full text-white mt-2"
        onClick={handleAddPlanButton}
      >
        Adicionar Plano
      </button>
    )
  }

  return (
    <main className="p-3">
      {
        isLoading
        ? <div className="w-full flex justify-center">
            <img src={loading} alt="" />
          </div>
        : <>
          <p className="font-bold mb-3">Adicionar plano</p>
            <form>
              <div className="mb-3">
                <label htmlFor="plan">Plano: </label>
                <select
                  id="planId"
                  name="planId"
                  className="p-2"
                  onChange={handleChange}
                  value={activePlan.id}
                >
                {
                  plans.map((plan) => (
                    <option value={plan.id} key={plan.id}>{plan.title}</option>
                  ))
                }
                </select>
              </div>
              <div className="mb-3">
                <p>
                  Expira em:
                  {
                    ` ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear() + 1}`
                  }
                </p>
              </div>
              <div>
                <p className="mb-3">
                  Valor do plano: R$ { 
                    activePlan.price.toLocaleString('pt-br', {minimumFractionDigits: 2})
                  }
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="expiration">Dia de vencimento da fatura: </label>
                <input
                  id="expiration"
                  name="expiration"
                  type="text"
                  className="w-12 p-2"
                  onChange={handleChange}
                  value={activePlan.expiration}
                />
              </div>
              <div>
                <label htmlFor="parcels">Parcelas: </label>
                <select
                  id="parcels"
                  name="parcels"
                  className="p-2 mb-3"
                  onChange={handleChange}
                  value={activePlan.parcels}
                >
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">4x</option>
                  <option value="5">5x</option>
                  <option value="6">6x</option>
                  <option value="7">7x</option>
                  <option value="8">8x</option>
                  <option value="9">9x</option>
                  <option value="10">10x</option>
                  <option value="11">11x</option>
                  <option value="12">12x</option>
                </select>
              </div>
              <button
                type="button"
                onClick={submitPlanForm}
                className="bg-green-900 p-2 text-center rounded-full text-white"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => {setIsShowing()}}
                className="bg-gray-600 ml-2 p-2 text-center rounded-full text-white"
              >
                Fechar
              </button>
            </form>
          </>
      }
    </main>
  )
}

export default AddPlan;