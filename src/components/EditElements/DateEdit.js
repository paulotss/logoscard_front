import { useState } from 'react';
import { DatePicker } from "@mui/x-date-pickers";
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from "dayjs";
import axios from '../../http';

const DateEdit = (props) => {
  const { title, entity, valueInput, userId } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(dayjs(valueInput, "DD/MM/YYYY"));

  const formatDate = (value) => {
    const date = new Date(value);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put('/user/edit', {
      userId,
      data: { [entity]: editValue }
    });
    setIsEditing(false);
  }

  return (
    <div className="min-w-[256px] p-2 rounded-lg border mr-2 mb-2">
      <p className="text-sm">{ title }</p>
      {
        isEditing
        ? <form className="flex">
            <DatePicker
              value={editValue}
              format="DD/MM/YYYY"
              onChange={(v) => {setEditValue(v) }}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="ml-2 cursor-pointer"
            >
              <CheckCircleIcon fontSize="small" />
            </button>
          </form>
        : <div>
            <span>{formatDate(editValue)}</span>
            <button
              className="ml-2 cursor-pointer"
              onClick={() => { setIsEditing(true) }}
            >
              <EditIcon fontSize="small" />
            </button>
          </div>
      }
    </div>
  )
}

export default DateEdit;
