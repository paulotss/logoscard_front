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
    fees: 0,
  });

  const handleAddDependent = (values) => {
    const newPrice = getPriceById(activePlan.planId, dependents.length + 1);
    const newFee = activePlan.parcels > 1 ? newPrice * 10 / 100 : 0
    setDependents([...dependents, values]);
    setActivePlan({
      ...activePlan,
      price: newPrice,
      fees: newFee
    });
  }

  const handleRemoveDependent = (cpf) => {
    const newPrice = getPriceById(activePlan.planId, dependents.length - 1);
    const newFee = activePlan.parcels > 1 ? newPrice * 10 / 100 : 0
    const update = dependents.filter((d) => d.cpf !== cpf);
    setActivePlan({
      ...activePlan,
      price: newPrice,
      fees: newFee,
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
        totalPrice: activePlan.price + activePlan.fees,
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

  const getPriceById = (planId, depLenth = dependents.length) => {
    const { price } = plans.find((plan) => plan.id === Number(planId));
    let finalPrice = price;
    finalPrice += depLenth * 230;
    return finalPrice;
  }

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "planId") {
      const newPrice = getPriceById(value);
      console.log(newPrice);
      setActivePlan({
        ...activePlan,
        [name]: Number(value),
        price: newPrice,
        fees: activePlan.parcels > 1 ? newPrice * 10 / 100 : 0
      });
    } else if (name === "parcels") {
      const newPrice = getPriceById(activePlan.planId);
      const newFee = value > 1 ? getPriceById(activePlan.planId) * 10 / 100 : 0
      setActivePlan({
        ...activePlan,
        [name]: value,
        price: newPrice + newFee,
        fees: newFee
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
            <section className="p-3">
              <p className="font-bold mb-3">Adicionar plano</p>
            <div className="flex">
              <form className="mb-3 w-fit">
                <div className="flex flex-wrap">
                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <label htmlFor="plan" className="text-sm">Plano</label>
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
                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <p className="text-sm">Expira em</p>
                    <DatePicker
                      value={expiration}
                      format="DD/MM/YYYY"
                      onChange={(v) => {setExpiration(v) }}
                    />
                  </div>
                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <label htmlFor="expiration" className="text-sm">Dia de vencimento da fatura</label>
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
                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <label htmlFor="parcels" className="text-sm">Parcelas</label>
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
                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <label htmlFor="method" className="text-sm">Forma de pagamento</label>
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

                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <p className="text-sm mb-1">Dependentes</p>
                    {
                      dependents.length > 0
                      ? dependents.map((d) => (
                        <div
                          key={d.cpf}
                          className="p-2 w-64 font-bold bg-gray-500 rounded-lg mr-2 mb-2 flex justify-between"
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
                    <AddDependent setDependents={handleAddDependent} />
                  </div>

                  <div className="p-2 border rounded-md m-2 w-80 h-fit">
                    <p className="text-sm">
                      Valor do plano
                    </p>
                    <p className='font-bold text-2xl'>
                    R$ { 
                        (activePlan.price + activePlan.fees).toLocaleString('pt-br', {minimumFractionDigits: 2})
                      }
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={submitPlanForm}
                  className="bg-green-900 p-2 text-center h-fit self-center rounded-md w-24 text-white m-2"
                >
                  Adicionar
                </button>
              </form>
              <aside className="w-96 border rounded bg-white p-5 h-fit">
                <div className="flex justify-between">
                  <div className="text-sm">Plano</div>
                  <div
                    className="text-2xl font-bold"
                  >
                    + R$ {
                      plans.find((plan) => plan.id === Number(activePlan.planId))
                        .price.toLocaleString('pt-br', {minimumFractionDigits: 2})
                    }
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">Dependentes</div>
                  <div>
                    {
                      dependents.length > 0 ?
                      dependents.map((_dependent, index) => (
                        <div key={index} className="text-2xl font-bold">
                          + R$ { (230).toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                        </div>
                      ))
                      : <div className="text-2xl font-bold">
                          + R$ { (0).toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                        </div>
                    }
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">Parcelas (10%)</div>
                  <div
                    className="text-2xl font-bold"
                  >
                    + R$ { activePlan.fees.toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                  </div>
                </div>
                <div className="flex justify-between border-t mt-2">
                  <div className="text-sm font-bold">Total</div>
                  <div
                    className="text-2xl font-bold"
                  >
                    R$ {
                      (activePlan.price + activePlan.fees).toLocaleString('pt-br', {minimumFractionDigits: 2})
                    }
                  </div>
                </div>
              </aside>
            </div>
            </section>
          </>
      }
    </main>
  )
}

export default AddPlanPage;
