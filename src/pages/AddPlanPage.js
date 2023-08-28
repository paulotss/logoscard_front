import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../http';
import loading from '../media/isLoading.gif';
import AddDependent from '../components/AddDependent';
import Header from '../components/Header';
import { HiMinusCircle } from 'react-icons/hi2';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";

const AddPlanPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ dependents, setDependents ] = useState([]);
  const [ plans, setPlans ] = useState(null);
  const [ expiration, setExpiration ] = useState(dayjs());
  const [ activePlan, setActivePlan ] = useState({
    planId: 1,
    method: 'PIX',
    expiration: '10',
    parcels: 1,
    price: 300,
  });

  const handleAddDependent = (values) => {
    setDependents([...dependents, values]);
    setActivePlan({
      ...activePlan,
      price: getPriceById(activePlan.planId, activePlan.price, dependents.length + 1)
    });
  }

  const handleRemoveDependent = (cpf) => {
    const update = dependents.filter((d) => d.cpf !== cpf);
    setActivePlan({
      ...activePlan,
      price: getPriceById(activePlan.planId, activePlan.price, dependents.length - 1)
    });
    setDependents(update);
  }

  const getPlanBenefits = (payload) => {
    const { benefits } = payload.assignments[0].plan;
    const result = benefits.map((benefit) => ({
        amount: benefit.amount && 0,
        benefitId: benefit.id,
        assignmentId: payload.assignments[0].id,
      })
    );
    return result;
  }

  const submitPlanForm = async () => {
    setIsLoading(true);
    try {
      const newUser = await axios.post('/assignment', {
        planId: activePlan.planId,
        userId: userId,
        expiration,
      });
      console.log(newUser.data);
      await axios.post('/invoices', {
        parcels: activePlan.parcels,
        day: activePlan.expiration,
        method: activePlan.method,
        dependents: dependents.length,
        userId: userId,
        totalPrice: activePlan.price,
      });
      await axios.post('/assignment/benefit', getPlanBenefits(newUser.data));
      if (dependents.length > 0) {
        const dependentsData = dependents.map((d) => ({
          user: d,
          assignmentId: newUser.data.assignments[0].id,
        }));
        await axios.post('/user/dependent', dependentsData);
      }
      navigate(`/client/${userId}`);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const getPriceById = (planId, parcels = activePlan.parcels, depLenth = dependents.length) => {
    const { price } = plans.find((plan) => plan.id === Number(planId));
    let finalPrice = price;
    finalPrice += depLenth * 230;
    if (parcels > 1) finalPrice += finalPrice * 10 / 100;
    return finalPrice;
  }

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "planId") {
      setActivePlan({
        ...activePlan,
        [name]: Number(value),
        price: getPriceById(value)
      });
    } else if (name === "parcels") {
      setActivePlan({
        ...activePlan,
        [name]: value,
        price: getPriceById(activePlan.planId, value),
      });
    }
    else {
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
                  <label htmlFor="plan">Plano</label>
                  <br/>
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
                  <p>Expira em</p>
                  <DatePicker
                    value={expiration}
                    format="DD/MM/YYYY"
                    onChange={(v) => {setExpiration(v) }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="expiration">Dia de vencimento da fatura</label>
                  <br/>
                  <input
                    id="expiration"
                    name="expiration"
                    type="text"
                    className="w-24 p-2"
                    onChange={handleChange}
                    value={activePlan.expiration}
                  />
                </div>
                <div>
                  <label htmlFor="parcels">Parcelas</label>
                  <br/>
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
                <div>
                  <label htmlFor="method">Forma de pagamento</label>
                  <br/>
                  <select
                    id="method"
                    name="method"
                    className="p-2 mb-3"
                    onChange={handleChange}
                    value={activePlan.method}
                  >
                    <option value="PIX">PIX</option>
                    <option value="CRÉDITO">CRÉDITO</option>
                    <option value="DÉBITO">DÉBITO</option>
                    <option value="DINHEIRO">DINHEIRO</option>
                  </select>
                </div>
                <div className="mb-3">
                  <p>
                    Valor do plano
                  </p>
                  <p className='font-bold text-2xl'>
                  R$ { 
                      activePlan.price.toLocaleString('pt-br', {minimumFractionDigits: 2})
                    }
                  </p>
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
              <AddDependent setDependents={handleAddDependent} />
            </section>
          </>
      }
    </main>
  )
}

export default AddPlanPage;
