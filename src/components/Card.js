import { useState, useRef } from 'react';
import axios from '../http';
import domtoimage from 'dom-to-image';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import bgCard from '../media/bg-card.png';

const CardPage = ({ clientId, expiration }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [client, setClient] = useState({});
  const cardRef = useRef();

  const formatId = (id) => {
    let result = id.toString();
    if (result.length < 3) {
      let zeros = 3 - result.length;
      while (zeros > 0) {
        result = "0" + result;
        zeros -= 1;
      }
    }
    return result;
  }

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

  const handleDownloadImage = () => {
    const targetEl = cardRef.current;
    domtoimage.toJpeg(targetEl, { quality: 0.95 }).then((dataUrl) => {
      let link = document.createElement('a');
      link.download = 'card.jpeg';
      link.href = dataUrl;
      link.click();
    });
  };
  
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
        <div>
          <div
            className={`mt-2 from-green-300 to-white w-[360px] h-[231px] relative`}
            style={{backgroundImage: `url(${bgCard})`}}
            ref={cardRef}
          >
              <div className="absolute top-[40px] left-[80px]">
                <p className="text-xs text-white">Nome do beneficiário</p>
                <p className="font-bold text-sm text-white">{ `${client.firstName} ${client.lastName}` }</p>
              </div>
              <div className="absolute top-[88px] left-[80px]">
                <p className="text-xs text-white">Número de inscrição</p>
                <p className="font-bold text-sm text-white">{ formatId(client.id) }</p>
              </div>
              <div className="absolute bottom-[63px] left-[80px]">
                <p className="text-xs text-white">Documento do beneficiário</p>
                <p className="font-bold text-sm text-white">{ client.rg }</p>
              </div>
              <div className="absolute bottom-[20px] left-[80px]">
                <p className="text-xs text-white">Válido até</p>
                <p className="font-bold text-sm text-white">
                  {
                    expiration === undefined
                    ? client.assignments.length > 0
                        ? formatDate(client.assignments[0].expiration)
                        : "DD/MM/YYYY"
                    : expiration
                  }
                </p>
              </div>
          </div>
          <button
            type="button"
            className="mt-2"
            onClick={handleDownloadImage}
          >
            <FileDownloadIcon/>
          </button>
        </div>
      }
    </section>
  )
}

export default CardPage;
