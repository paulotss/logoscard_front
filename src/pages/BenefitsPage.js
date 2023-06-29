import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
import loading from "../media/isLoading.gif";

const BenefitsPage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

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
  }, [id]);

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
              <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
              <div>Benefícios</div>
              <div className="text-right">Qnt.</div>
              <div className="text-right">Uso</div>
            </div>
            {
              user.assignment.benefits.map((benefit) => (
                <Link
                  to={`/invoice/${benefit.id}`}
                  key={benefit.id}
                  className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                >
                  <div>{benefit.title}</div>
                  <div className="text-right">{benefit.amount}</div>
                  <div className="text-right">{benefit.AssignmentBenefitModel.amount}</div>
                </Link>
              ))
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