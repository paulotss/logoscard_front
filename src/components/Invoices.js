import { useState, useEffect } from "react";
import axios from '../http';
import loading from '../media/isLoading.gif';

const Invoices = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState({
    paid: 168,
    pending: 51,
    overdue: 32,
    current: 32,
  });

  useEffect(() => {
    const getTotalInvoices = async () => {
      setIsLoading(true);
      const paid = await axios.get('/invoices/total/paid');
      const pending = await axios.get('/invoices/total/pending');
      const overdue = await axios.get('/invoices/total/overdue');
      const deposit = await axios.get('/deposit');
      const withdraw = await axios.get('/withdraw')
      setInvoice({
        paid: paid.data,
        pending: pending.data,
        overdue: overdue.data,
        current: deposit.data - withdraw.data,
      });
      setIsLoading(false);
    }
    getTotalInvoices();
  }, []);

  return (
    <section className="flex justify-center">
      {
        isLoading
        ? <div className="flex justify-center w-full">
            <img src={loading} alt="" />
          </div>
        : <>
            <div className="m-5">
              <p>Pagas</p>
              <p className="font-bold text-green-600 text-2xl">
                R$ {invoice.paid.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
            <div className="m-5">
              <p>Pendentes</p>
              <p className="font-bold text-yellow-600 text-2xl">
                R$ {invoice.pending.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
            <div className="m-5">
              <p>Vencidas</p>
              <p className="font-bold text-rose-600 text-2xl">
                R$ {invoice.overdue.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
            <div className="m-5">
              <p>Caixa</p>
              <p className="font-bold text-green-900 text-2xl">
                R$ {invoice.current.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
          </>
      }
    </section>
  )
}

export default Invoices;