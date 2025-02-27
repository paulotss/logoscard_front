import { useState } from "react";

const ButtonCard = () => {
  const [link, setLink] = useState("");

  const generateLink = () => {
    const newLink = `${window.location.origin}/card/create`;
    setLink(newLink);
  };

  return (
    <div className="flex flex-col items-start w-80"> 
      <button
        onClick={generateLink}
        className="p-2 w-24 bg-green-900 text-white rounded-md"  
      >
        Gerar
      </button>
      {link && (
        <div className="mt-3 w-full"> 
          <label htmlFor="generatedLink" className="block">Formulário:</label>
          <input
            id="generatedLink"
            type="text"
            readOnly
            value={link}
            className="w-full p-3 text-center mt-2 border rounded-md"  
          />
        </div>
      )}
    </div>
  );
};

export default ButtonCard;
