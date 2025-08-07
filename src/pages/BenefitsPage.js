import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../http";
import Header from "../components/Header";
//import { HiArrowUpCircle } from "react-icons/hi2";
import loading from "../media/isLoading.gif";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const BenefitsPage = () => {
  const [user, setUser] = useState({});
  const [benefitUp, setBenefitUp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [openUsage, setOpenUsage] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState({
    id: null,
    amount: null,
    description: "",
  });
  const { id } = useParams();

  const handleChangeDescription = ({ target }) => {
    const { value } = target;
    setCurrentBenefit({
      ...currentBenefit,
      description: value,
    })
  }

  const handleCloseUsage = () => {
    setOpenUsage(false);
  }

  const handleOpenUsege = (id, amount) => {
    console.log(id, amount);
    setCurrentBenefit({
      ...currentBenefit,
      id,
      amount,
    })
    setOpenUsage(true);
  }

  const handleButtonUsageBenefit = async () => {
    setOpenUsage(false);
    setIsLoading(true);
    const { id, amount } = currentBenefit;
    const assignmentBenefit = user.assignments[0].assignmentBenefit.find(
      (ab) => ab.benefit.id === Number(id)
    );
    const nDependents = user.assignments[0].dependents.length;
    if (assignmentBenefit.benefit.amount + nDependents > Number(amount)) {
      try {
        const result = await axios.put('/api/benefits/assignment/benefit', {
          amount: Number(amount) + 1,
          benefitId: id,
          assignmentId: user.assignments[0].id,
        });
        await axios.post('/api/benefits/benefit/note', {
          assignmentBenefitId: assignmentBenefit.id,
          description: currentBenefit.description,
        })
        setBenefitUp(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const result = await axios(`/api/users/user/${id}`);
        setUser(result.data);
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    getUser();
  }, [id, benefitUp]);

  return (
    <>
        {
          !isLoading
          ? <>
            <Header name={user.firstName} />
            <main className="p-5">
            <section>
              <p className="font-bold mb-3">Benefícios</p>
              <div className="mb-3">
                <p className="text-sm">Cliente</p>
                <p>{ `${user.firstName} ${user.lastName}` }</p>
              </div>
              <div className="mb-3">
                <p className="text-sm">Plano</p>
                <p>{ user.assignments[0].plan.title }</p>
              </div>
              <p className="font-bold mt-5">Benefícios ativos</p>
              <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
                <div>Benefício</div>
                <div className="text-right">Qnt.</div>
                <div className="text-right">Uso</div>
              </div>
              {
                user.assignments[0].assignmentBenefit.map((ab) => {
                  if (ab.benefit.type === 'active') {
                    return (
                    <div key={ab.benefit.id}>
                      <div
                        to={`/invoice/${ab.benefit.id}`}
                        className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                      >
                        <div>{ab.benefit.title}</div>
                        <div className="text-right">{ab.benefit.amount + user.assignments[0].dependents.length}</div>
                        <div className="text-right flex justify-end">
                          <button
                            type="button"
                            className="p-1 bg-blue-500 text-white rounded-lg w-10"
                            // onClick={handleButtonUsageBenefit}
                            onClick={() => handleOpenUsege(ab.benefitId, ab.amount)}
                            // value={ab.amount}
                            // id={ab.benefitId}
                          >
                            {ab.amount}
                          </button>
                        </div>
                      </div>
                      <div  className="flex flex-col">
                        {
                          ab.notes.map((note, index) => (
                            <div
                              key={note.id}
                              className="p-1 bg-blue-500 text-white mb-2"
                            >
                              {index + 1}. {note.description}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    )
                  }
                })
              }
              <p className="font-bold mt-3">Benefícios passivos</p>
              <div className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm">
                <div>Benefício</div>
                <div className="text-right">Qnt.</div>
                <div className="text-right">Uso</div>
              </div>
              {
                user.assignments[0].assignmentBenefit.map((ab) => {
                  if (ab.benefit.type === 'passive') {
                    return (
                    <div
                      to={`/invoice/${ab.benefit.id}`}
                      key={ab.benefit.id}
                      className="grid grid-gap grid-cols-3 grid-rows-1 bg-gray-400 rounded-lg p-2 mb-2"
                    >
                      <div>{ab.benefit.title}</div>
                      <div className="text-right">{ab.benefit.amount}</div>
                      <div className="text-right">{ab.amount}</div>
                    </div>)
                  }
                })
              }
              <Link
                to={`/client/${id}`}
              >
                <div className="bg-gray-600 p-2 mt-5 w-24 text-center text-white rounded-lg">
                  Voltar
                </div>
              </Link>
            </section>
            <Dialog open={openUsage} onClose={handleCloseUsage}>
              <DialogTitle>Uso de benefício</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="description"
                  label="Observação"
                  type="text"
                  value={currentBenefit.description}
                  onChange={handleChangeDescription}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleButtonUsageBenefit}
                >
                  Confirmar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseUsage}
                >
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
          </main>
          </>
          : <div className="flex justify-center mt-5">
              <img src={loading} alt="" />
            </div>
        }
    </>
  )
}

export default BenefitsPage;