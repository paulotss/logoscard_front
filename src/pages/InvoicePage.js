import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../http';
import Header from '../components/Header'
import loading from '../media/isLoading.gif';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (date) => {
    const format = new Date(date);
    let month = "";
    switch (format.getMonth() + 1) {
      case 1:
        month = "Janeiro";
        break;
      case 2:
        month = "Fevereiro";
        break;
      case 3:
        month = "Março";
        break;
      case 4:
        month = "Abril";
        break;
      case 5:
        month = "Maio";
        break;
      case 6:
        month = "Junho";
        break;
      case 7:
        month = "Julho";
        break;
      case 8:
        month = "Agosto";
        break;
      case 9:
        month = "Setembro";
        break;
      case 10:
        month = "Outubro";
        break;
      case 11:
        month = "Novembro";
        break;
      case 12:
        month = "Dezembro";
        break;
      default:
        month = "";
    }
    return `${month} | ${format.getFullYear()}`;
  }

  useEffect(() => {
    const getInvoice = async () => {
      setIsLoading(true)
      const result = await axios.get(`/invoice/${id}`);
      setInvoice(result.data);
      setIsLoading(false);
    }
    getInvoice();
  }, [id]);

  return (
    <>
      <Header />
      {
        isLoading
        ? <div className="flex justify-center w-full mt-5">
            <img src={loading} alt="" />
          </div>
        : <main className="p-5">
            <p className="font-bold">{ formatDate(invoice.expiration) }</p>
            { new Date(invoice.expiration) < new Date()
              ? <>
                  <p className="font-bold text-red-600 text-3xl mt-3">
                    R$
                    { invoice.amount.toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                  </p>
                  <p className="text-red-600 mb-2">Aguardando pagamento</p>
                  <button
                    type="button"
                    className="p-2 bg-red-600 mt-2 mr-2 rounded-full w-24 font-bold"
                  >
                    Pagar
                  </button>
                </>
              :  <p className="font-bold text-green-600 text-3xl mt-3">
                  R$
                  { invoice.amount.toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                </p>
            }
            <button
              type="button"
              className="p-2 bg-gray-400 mt-2 mr-2 rounded-full w-24 font-bold"
            >
              Voltar
            </button>
          </main>
      }
    </>
  )  
}

export default InvoicePage;
