import { useState, useEffect } from "react";
import axios from "../http";
import Header from "../components/Header";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from "@mui/material";

const CashFlowPage = () => {
  const [user, setUser] = useState({});
  
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);

  const [withdraws, setWithdraws] = useState([]);
  const [deposits, setDeposits] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    description: ""
  });

  const handleClickOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setWithdrawForm({
      ...withdrawForm,
      [name]: value,
    });
  }

  const handleSubmitWithdraw = async () => {
    const result = await axios.post('/withdraw',{
      amount: withdrawForm.amount,
      description: withdrawForm.description,
      userId: user.id,
    });
    setWithdraws([
      ...withdraws,
      result.data
    ]);
    setOpenDialog(false)
  }

  const convertDate = (stringDate) => {
    const dateObj = new Date(stringDate);
    const day = dateObj.getDay() < 10 ? `0${dateObj.getDay()}` : dateObj.getDay();
    const month = dateObj.getMonth() < 9 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const getUser = async () => {
      const result = await axios.get(`/user/${sessionStorage.getItem('auth')}`);
      setUser(result.data);
    }
    const getTotalWithdraw = async () => {
      const result = await axios.get('/withdraw');
      setTotalWithdraw(result.data);
    }
    const getTotalDeposit = async () => {
      const result = await axios.get('/deposit');
      setTotalDeposit(result.data);
    }
    const getWithdraws = async () => {
      const result = await axios.get('/withdraws');
      setWithdraws(result.data);
    }
    const getDeposits = async () => {
      const result = await axios.get('/deposits');
      setDeposits(result.data);
    }
    getUser();
    getTotalWithdraw();
    getTotalDeposit();
    getWithdraws();
    getDeposits();
  }, []);

  return (
    <>
      <Header />
      <main className="p-5">
        <section className="mb-5">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold">Saídas</h1>
              <h2 className="italic">Últimas 5</h2>
            </div>
            <div>
              <p
                className="font-bold text-red-600 text-xl"
              >
                R$ {totalWithdraw.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
          </div>
          <div className="grid grid-gap grid-cols-4 grid-rows-1 p-2 text-sm">
            <div>Usuário</div>
            <div>Data</div>
            <div>Descrição</div>
            <div className="text-right">Valor</div>
          </div>
          {
            withdraws.map((withdraw) => (
              <div
                key={withdraw.id}
                className="grid grid-gap grid-cols-4 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
              >
                <div>{withdraw.user.firstName}</div>
                <div>{convertDate(withdraw.createdAt)}</div>
                <div>{withdraw.description}</div>
                <div className="text-right">
                  R$ {
                    withdraw.amount.toLocaleString('pt-br', {minimumFractionDigits: 2})
                  }
                </div>
              </div>
            ))
          }
          <button
            onClick={handleClickOpen}
            className="p-2 bg-red-900 text-white rounded-lg w-24"
          >
            Retirar
          </button>
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
                R$ {totalDeposit.toLocaleString('pt-br', {minimumFractionDigits: 2})}
              </p>
            </div>
          </div>
          <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
            <div>Nº Fatura</div>
            <div>Data</div>
            <div className="text-right">Valor</div>
          </div>
          {
            deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
              >
                <div>{deposit.id}</div>
                <div>{convertDate(deposit.createdAt)}</div>
                <div className="text-right">
                  R$ {
                    deposit.amount.toLocaleString('pt-br', {minimumFractionDigits: 2})
                  }
                </div>
              </div>
            ))
          }
        </section>
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Retirar</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="amount"
              name="amount"
              label="Valor"
              type="text"
              value={withdrawForm.amount}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Descrição"
              type="text"
              value={withdrawForm.description}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="success"
              variant="contained"
              onClick={handleSubmitWithdraw}
            >
              Confirmar
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </>
  )
}

export default CashFlowPage;
