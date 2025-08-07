import { Fragment, useState } from "react";
import { useImmer } from "use-immer";
import axios from "../http";
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, TextField } from "@mui/material";

const Benefits = (props) => {
  const { data, assignmentId, dependents } = props;

  const [benefits, updateBenefits] = useImmer(data.map((d) => ({
    id: d.id,
    benefitId: d.benefit.id,
    title: d.benefit.title,
    type: d.benefit.type,
    amount: d.benefit.amount + dependents,
    usage: d.amount,
    notes: d.notes.map((note) => note.description),
  })));
  const [open, setOpen] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState({
    id: null,
    note: "",
  });

  const handleChangeNote = ({ target }) => {
    const { value } = target;
    setCurrentBenefit({ ...currentBenefit, note: value});
  }

  const handleClickOpen = (benefitId) => {currentBenefit.id
    setCurrentBenefit({ ...currentBenefit, id: benefitId});
    setOpen(true);
  }

  const handleSubmit = async () => {
    try {
      await axios.put('/api/benefits/assignment/benefit', {
        amount: benefits.find((b) => b.id === currentBenefit.id).usage + 1,
        benefitId: benefits.find((b) => b.id === currentBenefit.id).benefitId,
        assignmentId: assignmentId,
      });
      await axios.post('/api/benefits/benefit/note', {
        assignmentBenefitId: currentBenefit.id,
        description: currentBenefit.note,
      })
      updateBenefits(draft => {
        const benefit = draft.find(b =>
          b.id === currentBenefit.id
        );
        benefit.usage += 1;
        benefit.notes.push(currentBenefit.note);
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section>
      <div className="grid grid-gap grid-cols-3 grid-rows-1 mb-2 text-sm">
        <div>Benefício</div>
        <div className="text-right">Qnt.</div>
        <div className="text-right">Uso</div>
      </div>

      {
        benefits.map((benefit) => (
          <Fragment key={benefit.id}>
            <div
              className="grid grid-gap grid-cols-3 grid-rows-1 p-2 text-sm bg-gray-400 mb-1 rounded-md"
            >
              <div>{benefit.title}</div>
              {
                benefit.type === "active"
                ? <>
                    <div className="text-right">{benefit.amount}</div>
                    <div className="text-right">
                      <button
                        type="button"
                        className="w-10 rounded-md bg-[#288D85] disabled:bg-gray-400"
                        onClick={() => {handleClickOpen(benefit.id)}}
                        disabled={benefit.usage >= benefit.amount}
                      >
                        {benefit.usage}
                      </button>
                    </div>
                  </>
                : <div className="col-span-2"> </div>
              }
            </div>
            {
              benefit.notes.map((note, index) => (
                <p
                  key={index}
                  className="mb-2 p-2 bg-[#288D85] text-xs"
                >
                  {note}
                </p>
              ))
            }
          </Fragment>
        ))
      }
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Uso de benefício</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="note"
            label="Observação"
            type="text"
            value={currentBenefit.note}
            onChange={handleChangeNote}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  )
}

export default Benefits;
