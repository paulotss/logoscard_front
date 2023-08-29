import { Link, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logo from '../media/logo1.png';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('auth');
    navigate('/login');
  }

  return (
    <header
    className="flex justify-between bg-[#1C232E] text-white p-5 items-center"
    >
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <nav className="flex list-none w-full p-2 justify-center">
        <Link
          to="/"
          className="text-lg p-2 hover:border-b-2 border-b-white mr-2"
        >
          Home
        </Link>
        <Link
          to="/clients"
          className="text-lg p-2 hover:border-b-2 border-b-white mr-2"
        >
          Clientes
        </Link>
        <Link
          to="/dependents"
          className="text-lg p-2 hover:border-b-2 border-b-white mr-2"
        >
          Dependentes
        </Link>
        <Link
          to="/cashflow"
          className="text-lg p-2 hover:border-b-2 hover:border-b-white mr-2 border-b-2 border-b-[#1C232E]"
        >
          Caixa
        </Link>
      </nav>
      <div className="flex">
        <button
          onClick={logout}
        >
          <ExitToAppIcon />
        </button>
      </div>
    </header>
  )

}

export default Header;
