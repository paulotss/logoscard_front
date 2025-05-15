import { useState } from "react";

const ButtonCard = ({ id }) => {
  const [inputValue, setInputValue] = useState("");
  const [link, setLink] = useState("");

  const convertToCents = (value) => {
    const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return null;
    return Math.round(parsed * 100);
  };

  const generateLink = () => {
    const amountInCents = convertToCents(inputValue);
    if (amountInCents === null) {
      alert("Digite um valor válido (ex: 19,90)");
      return;
    }
    const newLink = `${window.location.origin}/card/create/${id}/${amountInCents}`;
    setLink(newLink);
  };

  const handleAmountChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="flex flex-col items-start w-full max-w-lg">
      <label htmlFor="amount" className="mb-2">Digite o valor da assinatura:</label>
      <input
        id="amount"
        type="text"
        value={inputValue}
        onChange={handleAmountChange}
        className="w-full p-2 border border-black rounded-md mb-3"
        placeholder="Ex: 19,90"
      />
      <button
        onClick={generateLink}
        className={`p-2 w-24 bg-green-900 text-white rounded-md ${!inputValue ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!inputValue}
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
