import { useState } from "react";

const Invoices = () => {
  const [invoice] = useState({
    paid: 168,
    pending: 51,
    overdue: 32
  });

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