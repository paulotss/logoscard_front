import { Link } from "react-router-dom";

const InvoicesList = (props) => {
  const { invoices } = props;

  const formatDate = (date) => {
    const format = new Date(date);
    return `${format.getUTCDate()}/${format.getMonth() + 1}/${format.getUTCFullYear()}`;
  }

  return (
    <section className="mt-5 mb-5">
      <p className="font-bold">Faturas</p>
      <div className="grid grid-gap grid-cols-4 grid-rows-1 p-2 text-sm">
        <div>Número</div>
        <div>Valor</div>
        <div>Vencimento</div>
        <div className="text-right">Status</div>
      </div>
      {
        invoices.map((invoice) => (
          <Link
            to={`/invoice/${invoice.id}`}
            key={invoice.id}
            className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
          >
            <div>00{invoice.id}</div>
            <div>R$ {invoice.amount.toLocaleString('pt-br', {minimumFractionDigits: 2})}</div>
            <div>{formatDate(invoice.expiration)}</div>
            <div className="text-right pr-2">
              {
                invoice.paid
                ? <div className="w-3 h-3 bg-green-900 rounded-full inline-block"> </div>
                : <div className="w-3 h-3 bg-red-900 rounded-full inline-block"> </div>
              }
            </div>
          </Link>
        ))
      }
    </section>
  )
}

export default InvoicesList;
