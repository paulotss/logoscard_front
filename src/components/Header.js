import { useState } from "react";

const Header = () => {
  const [user] = useState({
    firstName: "Paulo de Tarso",
  });

  return (
    <header
    className="flex justify-between bg-gray-900 text-white p-5"
    >
      <div className="bg-gray-300 p-2 rounded-full font-bold text-gray-900">
        LOGOSCARD
      </div>
      <div className="flex">
        <div className="mr-5 pt-2">
          Olá, <span className="font-bold">{user.firstName}</span>
        </div>
        <div className="bg-gray-300 p-2 rounded-full font-bold text-gray-900 w-20 text-center">
          Sair
        </div>
      </div>
    </header>
  )

}

export default Header;
