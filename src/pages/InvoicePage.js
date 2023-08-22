import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../http';
import Header from '../components/Header'
import loading from '../media/isLoading.gif';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({});
  const [openDialog, setOpenDialog] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  }

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

  const handleClickPay = async () => {
    try {
      await axios.put('/invoice/pay', {
        invoiceId: invoice.id
      });
      await axios.post('/deposit', {
        amount: invoice.amount,
        invoiceId: invoice.id,
      });
      setInvoice({
        ...invoice,
        paid: 1,
      });
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const getInvoice = async () => {
      setIsLoading(true);
      try {
        const result = await axios.get(`/invoice/${id}`);
        setInvoice(result.data);
      } catch (error) {
        navigate('/404');
      }
      setIsLoading(false);
    }
    getInvoice();
  }, [id, navigate]);

  return (
    <>
      <Header />
      {
        isLoading
        ? <div className="flex justify-center w-full mt-5">
            <img src={loading} alt="" />
          </div>
        : <main className="p-5">
            <section className="pb-3 border-b-2 border-b-gray-400">
              <p className="font-bold mb-2">Fatura</p>
              <p className="font-bold mb-2 text-gray-600">{`Método: ${invoice.method}`}</p>
              <p className="font-bold">{ formatDate(invoice.expiration) }</p>
              { !invoice.paid
                ? <>
                    <p className="font-bold text-red-600 text-3xl mt-3">
                      R$
                      { invoice.amount.toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                    </p>
                    <p className="text-red-600 mb-2">Aguardando pagamento</p>
                    <button
                      type="button"
                      className="p-2 bg-red-600 mt-2 mr-2 rounded-full w-24 font-bold"
                      onClick={handleOpenDialog}
                    >
                      Pagar
                    </button>
                  </>
                : <>
                    <p className="font-bold text-green-600 text-3xl mt-3">
                      R$
                      { invoice.amount.toLocaleString('pt-br', {minimumFractionDigits: 2}) }
                    </p>
                    <p className="text-green-600 mb-2">Fagura paga</p>
                  </>
              }
              <button
                type="button"
                className="p-2 bg-gray-400 mt-2 mr-2 rounded-full w-24 font-bold"
                onClick={() => { navigate(-1) }}
              >
                Voltar
              </button>
            </section>
            <section className="mt-3">
              <p className="text-sm mt-3">Inscrição</p>
              <p>00{invoice.user.id}</p>
              <p className="text-sm mt-3">Nome</p>
              <p>{`${invoice.user.firstName} ${invoice.user.lastName}`}</p>
              <p className="text-sm mt-3">CPF</p>
              <p>{invoice.user.cpf}</p>
            </section>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Tem certeza?</DialogTitle>
              <DialogActions>
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleClickPay}
                >
                  Confimar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
          </main>
      }
    </>
  )  
}

export default InvoicePage;
