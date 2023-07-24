import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../http';
import loading from '../media/isLoading.gif';
import AddDependent from '../components/AddDependent';
import Header from '../components/Header';
import { HiMinusCircle } from 'react-icons/hi2';

const AddPlanPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ dependents, setDependents ] = useState([]);
  const [ plans, setPlans ] = useState(null);
  const [ activePlan, setActivePlan ] = useState({
    planId: 1,
    expiration: "10",
    parcels: 1,
    price: 0,
  });

  const handleRemoveDependent = (cpf) => {
    const update = dependents.filter((d) => d.cpf !== cpf);
    setDependents(update);
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
        planId: activePlan.id,
        userId: userId,
        expiration: getExpirationDay(),
      });
      console.log(newUser.data);
      await axios.post('/invoices', {
        parcels: activePlan.parcels,
        day: activePlan.expiration,
        userId: userId,
        totalPrice: activePlan.price,
      });
      await axios.post('/assignment/benefit', getPlanBenefits(newUser.data));
      if (dependents.length > 0) {
        const dependentsData = dependents.map((d) => ({
          user: d,
          assignmentId: newUser.data.assignment.id,
        }));
        await axios.post('/user/dependent', dependentsData);
      }
      navigate(`/client/${userId}`);
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
      console.log(name, value);
      console.log(activePlan);
      setActivePlan({
        ...activePlan,
        [name]: Number(value),
        price: getPriceById(value)
      });
    } else {
      setActivePlan({
        ...activePlan,
        [name]: value,
      });
    }
  }

  useEffect(() => {
    const getPlans = async () => {
      setIsLoading(true);
        try {
          const result = await axios.get('/plans');
          setActivePlan((prevState) => ({
            ...prevState,
            ...result.data[0],
          }));
          setPlans(result.data);
        } catch (error) {
          console.log(error);
        }
      setIsLoading(false);
    }
    getPlans();
  }, []);

  return (
    <main>
      {
        isLoading
        ? <div className="w-full flex justify-center">
            <img src={loading} alt="" />
          </div>
        : <>
            <Header />
            <section className='p-3'>
            <p className="font-bold mb-3">Adicionar plano</p>
              <form className="mb-3">
                <div className="mb-3">
                  <label htmlFor="plan">Plano: </label>
                  <select
                    id="planId"
                    name="planId"
                    className="p-2"
                    onChange={handleChange}
                    value={activePlan.planId}
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
                {
                  dependents.length > 0
                  ? dependents.map((d) => (
                    <div
                      key={d.cpf}
                      className="p-2 w-96 font-bold bg-gray-500 rounded-lg mr-2 mb-2 flex justify-between"
                    >
                      <div>{ `${d.firstName} ${d.lastName}` }</div>
                      <button
                        type='button'
                        onClick={() => { handleRemoveDependent(d.cpf) }}
                      >
                        <HiMinusCircle color='red' />
                      </button>
                    </div>
                  ))
                  : null
                }
                <button
                  type="button"
                  onClick={submitPlanForm}
                  className="bg-green-900 p-2 text-center rounded-full text-white"
                >
                  Adicionar
                </button>
              </form>
              <AddDependent setDependents={setDependents} dependents={dependents} />
            </section>
          </>
      }
    </main>
  )
}

export default AddPlanPage;
