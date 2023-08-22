import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('auth');
    navigate('/login');
  }

  return (
    <header
    className="flex justify-between bg-gray-900 text-white p-5 items-center"
    >
      <Link to="/" className="bg-gray-300 p-2 h-fit rounded-full font-bold text-gray-900">
        LOGOSCARD
      </Link>
      <nav className="flex list-none w-full p-2 justify-center">
        <Link
          to="/"
          className="p-2 hover:bg-gray-300 hover:text-gray-900 rounded-md border border-white mr-2"
        >
          Home
        </Link>
        <Link
          to="/clients"
          className="p-2 hover:bg-gray-300 hover:text-gray-900 rounded-md border border-white mr-2"
        >
          Clientes
        </Link>
        <Link
          to="/dependents"
          className="p-2 hover:bg-gray-300 hover:text-gray-900 rounded-md border border-white mr-2"
        >
          Dependentes
        </Link>
        <Link
          to="/cashflow"
          className="p-2 hover:bg-gray-300 hover:text-gray-900 rounded-md border border-white"
        >
          Caixa
        </Link>
      </nav>
      <div className="flex">
        <button
          onClick={logout}
          className="bg-gray-300 p-2 h-fit rounded-full font-bold text-gray-900 w-20 text-center"
        >
          Sair
        </button>
      </div>
    </header>
  )

}

export default Header;
