import { useEffect, useState } from "react";
import axios from "axios";

const ButtonCard = ({ id }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/plans");
        const activePlans = response.data;
        setPlans(activePlans);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedPlanId(event.target.value);
  };

  const generateLink = () => {
    if (!selectedPlanId) {
      alert("Selecione um plano válido");
      return;
    }

    const newLink = `${window.location.origin}/card/create/${id}/${selectedPlanId}`;
    setLink(newLink);
  };

  return (
    <div className="flex flex-col items-start w-full max-w-lg">
      <label htmlFor="planSelect" className="mb-2">Selecione um plano:</label>
      <select
        id="planSelect"
        value={selectedPlanId}
        onChange={handleSelectChange}
        className="w-full max-w-md p-2 border border-black rounded-md mb-3"
      >
        <option value="">-- Selecione --</option>
        {plans.map(plan => (
          <option key={plan.id} value={plan.id}>
            {plan.title} - R$ {plan.price.toFixed(2)}
          </option>
        ))}
      </select>

      <br/>

      <button
        onClick={generateLink}
        className={`p-2 w-24 bg-green-900 text-white rounded-md ${!selectedPlanId ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!selectedPlanId}
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
