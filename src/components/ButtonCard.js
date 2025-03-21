import { useState } from "react";

const ButtonCard = ({ id }) => {
    const [link, setLink] = useState("");
    const [amount, setAmount] = useState("");
  
    const generateLink = () => {
      const newLink = `${window.location.origin}/card/create/${id}`;
      setLink(newLink);
    };

    const handleAmountChange = (event) => {
      const value = event.target.value.replace(/\D/g, ""); // Permite apenas números
      setAmount(value);
    };

  return (
    <div className="flex flex-col items-start w-80"> 
    <label htmlFor="amount" className="mb-2">Digite o valor da assinatura:</label>
        <input
        id="amount"
        type="text"
        value={amount}
        onChange={handleAmountChange}
        className="w-full p-2 border border-black rounded-md mb-3"
        placeholder="Digite um valor"
        />
      <button
        onClick={generateLink}
        className={`p-2 w-24 bg-green-900 text-white rounded-md ${!amount ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!amount}  
      >
        Gerar
      </button>
      {link && (
        <div className="mt-3 w-full"> 
          <label htmlFor="generatedLink" className="block">Formulário:</label>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full p-3 text-center mt-2 border border-black rounded-md text-blue-600 underline bg-white"
          >
            {link}
          </a>
        </div>
      )}
    </div>
  );
};

export default ButtonCard;
