import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('auth');
    navigate('/login');
  }

  return (
    <header
    className="flex justify-between bg-gray-900 text-white p-5"
    >
      <Link to="/" className="bg-gray-300 p-2 rounded-full font-bold text-gray-900">
        LOGOSCARD
      </Link>
      <div className="flex">
        <button
          onClick={logout}
          className="bg-gray-300 p-2 rounded-full font-bold text-gray-900 w-20 text-center"
        >
          Sair
        </button>
      </div>
    </header>
  )

}

export default Header;
