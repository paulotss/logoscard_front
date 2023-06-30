import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
//import { HiArrowUpCircle } from "react-icons/hi2";
import loading from "../media/isLoading.gif";

const BenefitsPage = () => {
  const [user, setUser] = useState({});
  const [benefitUp, setBenefitUp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const handleButtonUsageBenefit = async ({ target }) => {
    setIsLoading(true);
    const { id, value } = target;
    const benefit = user.assignment.benefits.find((benefit) => benefit.id === Number(id));
    if (benefit.amount > Number(value)) {
      try {
        const result = await axios.put('/assignment/benefit', {
          amount: Number(value) + 1,
          benefitId: id,
          assignmentId: user.assignment.id,
        });
        setBenefitUp(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const result = await axios(`/user/${id}`);
        setUser(result.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    getUser();
  }, [id, benefitUp]);

  return (
    <>
      <Header />
      <main className="p-5">
        {
          !isLoading
          ? <section>
              <p className="font-bold mb-3">Benefícios</p>
              <div className="mb-3">
                <p className="text-sm">Cliente</p>
                <p>{ `${user.firstName} ${user.lastName}` }</p>
              </div>
              <div className="mb-3">
                <p className="text-sm">Plano</p>
                <p>{ user.assignment.plan.title }</p>
              </div>
              <p className="font-bold mt-5">Benefícios ativos</p>
              <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
                <div>Benefício</div>
                <div className="text-right">Qnt.</div>
                <div className="text-right">Uso</div>
              </div>
              {
                user.assignment.benefits.map((benefit) => {
                  if (benefit.type === 'active') {
                    return (
                    <div
                      to={`/invoice/${benefit.id}`}
                      key={benefit.id}
                      className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                    >
                      <div>{benefit.title}</div>
                      <div className="text-right">{benefit.amount}</div>
                      <div className="text-right flex justify-end">
                        <div>{benefit.AssignmentBenefitModel.amount}</div>
                        <button
                          type="button"
                          className="ml-1 font-bold"
                          onClick={handleButtonUsageBenefit}
                          value={benefit.AssignmentBenefitModel.amount}
                          id={benefit.AssignmentBenefitModel.benefitId}
                        >
                          ^
                        </button>
                      </div>
                    </div>)
                  }
                })
              }
              <p className="font-bold mt-3">Benefícios passivos</p>
              <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
                <div>Benefício</div>
                <div className="text-right">Qnt.</div>
                <div className="text-right">Uso</div>
              </div>
              {
                user.assignment.benefits.map((benefit) => {
                  if (benefit.type === 'passive') {
                    return (
                    <div
                      to={`/invoice/${benefit.id}`}
                      key={benefit.id}
                      className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                    >
                      <div>{benefit.title}</div>
                      <div className="text-right">{benefit.amount}</div>
                      <div className="text-right">{benefit.AssignmentBenefitModel.amount}</div>
                    </div>)
                  }
                })
              }
            </section>
          : <div className="flex justify-center mt-5">
              <img src={loading} alt="" />
            </div>
        }
        
      </main>
    </>
  )
}

export default BenefitsPage;