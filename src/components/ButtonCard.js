import { useEffect, useState } from "react";
import axios from "../http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ButtonCard = ({ id }) => {
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "https://logoscardback-production.up.railway.app/pagbank/plans"
        );
        const allPlans = Array.isArray(response?.data?.plans)
          ? response.data.plans
          : [];
        const activePlans = allPlans.filter((plan) => plan.status === "ACTIVE");
        setPlans(activePlans);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    };
    fetchPlans();
  }, []);
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

  const handleSelectChange = (event) => {
    setSelectedPlanId(event.target.value);
  };

  return (
    <>
      <label htmlFor="planSelect" className="mb-2">
        Selecione um plano:
      </label>
      <select
        id="planSelect"
        value={selectedPlanId}
        onChange={handleSelectChange}
        className="w-full max-w-md p-2 border border-black rounded-md mb-3"
      >
        <option value="">-- Selecione --</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name} - R$ {(plan.amount.value / 100).toFixed(2)}
          </option>
        ))}
      </select>

      <br />
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
