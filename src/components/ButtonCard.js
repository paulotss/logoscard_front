import { useState } from "react";

const ButtonCard = ({ id }) => {
    const [link, setLink] = useState("");
  
    const generateLink = () => {
      const newLink = `${window.location.origin}/card/create/${id}`;
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
