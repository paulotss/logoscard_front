import { useState } from 'react';
import bgCard from '../media/bg-card.png';
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
          className={`mt-2 from-green-300 to-white w-[360px] h-[231px] relative`}
          style={{backgroundImage: `url(${bgCard})`}}
        >
            <div className="absolute top-[40px] left-[80px]">
              <p className="text-xs text-white">Nome do beneficiário</p>
              <p className="font-bold text-sm text-white">{ `${client.firstName} ${client.lastName}` }</p>
            </div>
            <div className="absolute top-[88px] left-[80px]">
              <p className="text-xs text-white">Número de inscrição</p>
              <p className="font-bold text-sm text-white">{ `00${client.id}` }</p>
            </div>
            <div className="absolute bottom-[63px] left-[80px]">
              <p className="text-xs text-white">Documento do beneficiário</p>
              <p className="font-bold text-sm text-white">{ client.rg }</p>
            </div>
            <div className="absolute bottom-[20px] left-[80px]">
              <p className="text-xs text-white">Válido até</p>
              <p className="font-bold text-sm text-white">
                { client.assignments.length > 0 ? formatDate(client.assignments[0].expiration) : "DD/MM/YYYY" }
              </p>
            </div>
        </div>
      }
    </section>
  )
}

export default CardPage;
