import { useState } from "react";
import axios from "../http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ButtonCard = ({ id }) => {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateLink = async () => {
    setIsLoading(true);
    try {
      // Generate secure token on backend instead of simple URL
      const response = await axios.post(
        "/card/generate-token",
        {
          userId: id,
        },
        {
          headers: {
            authorization: sessionStorage.getItem("auth"),
          },
        }
      );

      const { token } = response.data;
      const newLink = `${window.location.origin}/card/create/${token}`;
      setLink(newLink);
      toast.success("Link gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast.error("Erro ao gerar link. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <>
      <div className="flex flex-col items-start w-80">
        <button
          onClick={generateLink}
          disabled={isLoading}
          className={`p-2 w-24 rounded-md ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-900 hover:bg-green-800"
          } text-white`}
        >
          {isLoading ? "Gerando..." : "Gerar"}
        </button>
        {link && (
          <div className="mt-3 w-full">
            <label htmlFor="generatedLink" className="block">
              Formulário (válido por 24h):
            </label>
            <div className="flex mt-2">
              <input
                id="generatedLink"
                type="text"
                readOnly
                value={link}
                className="w-full p-3 text-center border rounded-l-md"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md"
              >
                Copiar
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Este link expira em 24 horas e pode ser usado apenas uma vez.
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ButtonCard;
