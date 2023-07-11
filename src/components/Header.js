import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user] = useState({
    firstName: "Paulo de Tarso",
  });

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
        <div className="mr-5 pt-2">
          Olá, <span className="font-bold">{user.firstName}</span>
        </div>
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
