import { useState } from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import logo from '../media/logo1.png';
import axios from '../http';

const CardPage = ({ clientId }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [client, setClient] = useState({});

  const formatDate = (value) => {
    const date = new Date(value);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleClickShow = async () => {
    const result = await axios.get(`/user/${clientId}`);
    setClient(result.data);
    setIsShowing(true);
  }
  
  return (
    <section>
      <div>
        {
          !isShowing
          ? <button
              type="button"
              className="p-2 bg-blue-400 mr-2 rounded-md w-24"
              onClick={handleClickShow}
            >
              Gerar
            </button>
          : <button
              type="button"
              className="p-2 bg-blue-400 rounded-md w-24"
              onClick={() => {setIsShowing(false)}}
            >
              Esconder
            </button>
        }
      </div>
      {
        isShowing &&
        <div
          className="mt-2 p-5 bg-gradient-to-r from-green-300 to-white w-96 h-fit flex justify-between rounded-lg"
        >
          <div>
            <div className="mb-3">
              <p className="text-sm">Nome do beneficiário</p>
              <p className="font-bold">{ `${client.firstName} ${client.lastName}` }</p>
            </div>
            <div className="mb-3">
              <p className="text-sm">Número de inscrição</p>
              <p className="font-bold">{ `00${client.id}` }</p>
            </div>
            <div className="mb-3">
              <p className="text-sm">Documento do beneficiário</p>
              <p className="font-bold">{ client.rg }</p>
            </div>
            <div>
              <p className="text-sm">Válido até</p>
              <p className="font-bold">
                { client.assignments.length > 0 ? formatDate(client.assignments[0].expiration) : "DD/MM/YYYY" }
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end">
            <div className="w-24 h-24 bg-gray-300 rounded-lg">
              {
                client.photo
                ? <img src={client.photo} alt="" />
                : <AccountBoxIcon sx={{ width: 96, height: 96 }} />
              }
            </div>
            <div className="flex">
              <img className="w-12" src={logo} alt="" />
            </div>
          </div>
        </div>
      }
    </section>
  )
}

export default CardPage;
