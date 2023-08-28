import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from '../../http';

const InputEdit = (props) => {
  const { title, entity, valueInput } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(valueInput)

  const handleChange = ({ target }) => {
    setEditValue(target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put('client/edit', {
      [entity]: editValue
    });
    setIsEditing(false)
  }

  return (
    <div className="mb-5">
      <p className="text-sm">{ title }</p>
      { isEditing
        ? <form>
            <input
              type="text"
              value={valueInput}
              onChange={handleChange}
              className="p-2 mr-2"
            />
            <button type="submit" onClick={handleSubmit}>
              <CheckCircleIcon fontSize="small" />
            </button>
          </form>
        : <div>
            <span>{ valueInput }</span>
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

export default InputEdit;