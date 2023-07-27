
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import logo from "../media/logo1.png";

const CardPage = ({ client }) => {
  return (
    <div
      className="p-5 bg-gradient-to-r from-green-300 to-white w-96 h-fit flex justify-between rounded-lg"
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
            { client.assignment ? client.assignment.expiration : "DD/MM/YYYY" }
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
  )
}

export default CardPage;
