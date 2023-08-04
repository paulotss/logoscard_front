import { useState, useEffect } from "react";
import axios from "../http";
import Header from "../components/Header";

const CashFlowPage = () => {
  const [withdraw, setWithdraw] = useState(0);
  const [deposit, setDeposit] = useState(0);

  useEffect(() => {
    const getWithdraw = async () => {
      const result = await axios.get('/withdraw');
      setWithdraw(result.data);
    }
    const getDeposit = async () => {
      const result = await axios.get('/deposit');
      setDeposit(result.data);
    }
    getWithdraw();
    getDeposit();
  }, []);

  return (
    <>
      <Header />
      <main className="p-5">
        <section className="mb-3">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold">Saídas</h1>
              <h2 className="italic">Últimas 5</h2>
            </div>
            <div>
              <p
                className="font-bold text-red-600 text-xl"
              >
                R$ {withdraw.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
          </div>
        </section>
        <section className="mb-3">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold">Entradas</h1>
              <h2 className="italic">Últimas 5</h2>
            </div>
            <div>
              <p
                className="font-bold text-green-900 text-xl"
              >
                R$ {deposit.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default CashFlowPage;
