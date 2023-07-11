import { useState, useEffect } from "react";
import axios from '../http';
import loading from '../media/isLoading.gif';

const Invoices = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState({
    paid: 168,
    pending: 51,
    overdue: 32
  });

  useEffect(() => {
    const getTotalInvoices = async () => {
      setIsLoading(true);
      const paid = await axios.get('/invoices/total/paid');
      const pending = await axios.get('/invoices/total/pending');
      const overdue = await axios.get('/invoices/total/overdue');
      setInvoice({
        paid: paid.data,
        pending: pending.data,
        overdue: overdue.data,
      });
      setIsLoading(false);
    }
    getTotalInvoices();
  }, []);

  return (
    <section className="flex justify-between">
      {
        isLoading
        ? <div className="flex justify-center w-full">
            <img src={loading} alt="" />
          </div>
        : <>
            <div>
              <p>Pagas</p>
              <p className="font-bold text-green-600 text-2xl">
                R$ {invoice.paid.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
            <div>
              <p>Pendentes</p>
              <p className="font-bold text-yellow-600 text-2xl">
                R$ {invoice.pending.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
            <div>
              <p>Vencidas</p>
              <p className="font-bold text-rose-600 text-2xl">
                R$ {invoice.overdue.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
          </>
      }
    </section>
  )
}

export default Invoices;