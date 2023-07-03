import { useState, useEffect } from "react";
import axios from '../http';

const Invoices = () => {
  const [invoice, setInvoice] = useState({
    paid: 168,
    pending: 51,
    overdue: 32
  });

  useEffect(() => {
    const getTotalInvoices = async () => {
      const paid = await axios.get('/invoices/total/paid');
      const pending = await axios.get('/invoices/total/pending');
      setInvoice((prevState) => (
        {
          ...prevState,
          paid: paid.data,
          pending: pending.data,
        }
      ));
    }
    getTotalInvoices();
  }, []);

  return (
    <section className="flex justify-between">
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
    </section>
  )
}

export default Invoices;