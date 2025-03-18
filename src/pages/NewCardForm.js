/* global PagSeguro */

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../http";
import loading from "../media/isLoading.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const NewCardForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pagSeguroReady, setPagSeguroReady] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState({});



  // Carrega o SDK quando o componente é montado
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js";
    script.async = true;
    script.onload = () => {
      setPagSeguroReady(true);
      console.log("PagSeguro SDK carregado!");
    };
    script.onerror = (err) => {
      console.error("Erro ao carregar PagSeguro SDK:", err);
    };
    document.body.appendChild(script);

    const getUser = async () => {
        setIsLoading(true);
        try {
          const result = await axios.get(`/user/${id}`);
          console.log(result)
          setUser(result.data);
        } catch (error) {
          console.error("Erro ao buscar o usuário:", error);
        }
        setIsLoading(false);
      };
      getUser();
  }, [id]);

  // Garantir que o script do PagSeguro foi carregado
  const submitForm = async (values) => {
    if (!pagSeguroReady) {
      toast.error("Erro, tente novamente"); 
      return;
    }
    // Muda para um estado de carregamento 
    setIsLoading(true);

    // TODO: Criar rota para chamar a chave pelo back-end

    try {
      // Criptografa os dados do cartão
      const card = PagSeguro.encryptCard({
        publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw0nc7xP2/MHB6AHbXle7xcwFky3hduqi383UwkjKYEADWThiFPa1tUnAAxzHJDhDYyDtssHsiuUE/GR0Q19ZdfRvfaSYk0sZTuzLU7mE6ilOis7J2jdB6QqZyqFxZ6Y4w8md8CRDrFr45p6WCo9T3VsWnOYhHaT4pcUsfxnSDkKfDHOcAzr6BMPKroacQPv/D7AOVrCwTY14dHcMfyTzfqhhHf2XayzSu3OQi0Jwx9vSDT4a+N7BCCCub7n1o7O0GzlX9N2Mbdw2Y+VwvyE5bICynr6PD/9uPkRsp+kaK+UJsZ1ulQPFsVkFjbJBAqFHANvDll3JJ/kPanR30AcQ1QIDAQAB",
        holder: values.holder,
        number: values.number,
        expMonth: values.expMonth,
        expYear: values.expYear,
        securityCode: values.securityCode,
      });

      // Verificar erros na criptografia do cartão
      if (card.hasErrors) {
        console.error("Erros na criptografia:", card.errors);
        console.log(card);
        console.log(card.hasErrors);
        toast.error("Erro ao criptografar os dados do cartão");
        setIsLoading(false);
        return;
      }

      // Envia os dados criptografados para a API

      // Criar cliente
      const customerData = {
        name: user.firstName,
        email: user.email,
        tax_id: user.cpf,
        phones: [
          {
            country: "55",
            area: user.cellPhone.substring(0, 2),
            number: user.cellPhone.substring(2)
          }
        ],
        birth_date: user.birthday.split("T")[0],
        billing_info: [
          {
            card: {
              holder: {
                phone: {
                  country: "55",
                  area: user.cellPhone.substring(0, 2),
                  number: user.cellPhone.substring(2)
                },
                name: user.firstName,
                birth_date: user.birthday.split("T")[0],
                tax_id: user.cpf
              },
              encrypted: card.encryptedCard
            },
            type: "CREDIT_CARD"
          }
        ]
      };
      
      console.log("Dados enviados para a API:", JSON.stringify(customerData, null, 2));
      
      const customerResponse = await axios.post("/signature/customers", customerData, {
        headers: { "Content-Type": "application/json" }
      });

      const customerId = customerResponse.data.id;
      console.log("Cliente criado com sucesso:", customerId);

      // Criar plano
      const planData = {
        amount: { currency: "BRL", value: 200000 },
        interval: { unit: "MONTH", length: 1 },
        trial: { enabled: false, hold_setup_fee: false, days: 0 },
        reference_id: "id_plano_test",
        name: "Plano Teste",
        description: "Plano para teste"
      };
  
      const planResponse = await axios.post("/signature/plans", planData, {
        headers: { "Content-Type": "application/json" }
      });
  
      const planId = planResponse.data.id;
      console.log("Plano criado com sucesso:", planId);

      // Criar assinatura
    const subscriptionData = {
        plan: { id: planId },
        customer: { id: customerId },
        amount: { value: 99900, currency: "BRL" },
        splits: {
          method: "FIXED",
          receivers: [{
            account: { id: "id_recebidor" },
            amount: { value: 10000 }
          }]
        },
        payment_method: [{
          type: "CREDIT_CARD",
          card: { security_code: values.securityCode }
        }],
        pro_rata: false,
        split_enabled: false,
        reference_id: "id_assinatura"
      };
  
      await axios.post("/signature/subscription", subscriptionData, {
        headers: { "Content-Type": "application/json" }
      });

      toast.success("Cartão cadastrado com sucesso!");
  
    } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Erro ao cadastrar cartão");
    }

    // Reativa o botão de envio
    setIsLoading(false);
  };

  return (
    <>
      {/* Carrega o componente de tela Header */}
      <Header hideNav={true} />

      {/* Bloco principal, container mais externo */}
      <main className="p-5 flex justify-center">

        {/* Seção que agrupa o formulário, está dentro da main */}
        <section className="w-full max-w-md">

          {/*componente da biblioteca Formik que facilita a criação e gerenciamento de formulários */}
          <Formik
            initialValues={{
              holder: "",
              number: "",
              expMonth: "",
              expYear: "",
              securityCode: "",
            }}
            // Define as regras de validação com a biblioteca Yup
            validationSchema={Yup.object({
              holder: Yup.string().required("Obrigatório"),
              number: Yup.string()
                .matches(/^\d{14,19}$/, "Número do cartão deve ter entre 14 e 19 dígitos")
                .required("Obrigatório"),
              expMonth: Yup.string()
                .matches(/^(0[1-9]|1[0-2])$/, "Informe um valor entre 01 e 12")
                .required("Obrigatório"),
              expYear: Yup.string()
                .matches(/^(2\d{3}|\d{2})$/, "Ano inválido")
                .required("Obrigatório"),
              securityCode: Yup.string()
                .matches(/^\d{3,4}$/, "Código inválido")
                .required("Obrigatório"),
            })}
            onSubmit={submitForm}
          >
            {(formik) => (
              // Formulário dentro da section
              <form className="flex flex-col items-center" onSubmit={formik.handleSubmit}>
                {/* Várias div com os inputs do formulário estilizados com Tailwind*/}
                <div className="mb-5 w-full text-center">
                  <label htmlFor="holder" className="block">Titular</label>
                  <input
                    id="holder"
                    type="text"
                    className="w-full p-2 text-center"
                    {...formik.getFieldProps("holder")}
                  />
                  {formik.touched.holder && formik.errors.holder ? (
                    <div className="text-red-600 text-sm">{formik.errors.holder}</div>
                  ) : null}
                </div>

                <div className="mb-5 w-full text-center">
                  <label htmlFor="number" className="block">Número do cartão</label>
                  <input
                    id="number"
                    type="text"
                    className="w-full p-2 text-center"
                    {...formik.getFieldProps("number")}
                  />
                  {formik.touched.number && formik.errors.number ? (
                    <div className="text-red-600 text-sm">{formik.errors.number}</div>
                  ) : null}
                </div>

                <div className="mb-5 flex gap-3 w-full justify-center">
                  <div className="w-1/3 text-center">
                    <label htmlFor="expMonth" className="block">Mês</label>
                    <input
                      id="expMonth"
                      type="text"
                      className="w-full p-2 text-center"
                      {...formik.getFieldProps("expMonth")}
                    />
                    {formik.touched.expMonth && formik.errors.expMonth ? (
                      <div className="text-red-600 text-sm">{formik.errors.expMonth}</div>
                    ) : null}
                  </div>

                  <div className="w-1/3 text-center">
                    <label htmlFor="expYear" className="block">Ano</label>
                    <input
                      id="expYear"
                      type="text"
                      className="w-full p-2 text-center"
                      {...formik.getFieldProps("expYear")}
                    />
                    {formik.touched.expYear && formik.errors.expYear ? (
                      <div className="text-red-600 text-sm">{formik.errors.expYear}</div>
                    ) : null}
                  </div>

                  <div className="w-1/3 text-center">
                    <label htmlFor="securityCode" className="block">CVV</label>
                    <input
                      id="securityCode"
                      type="password"
                      className="w-full p-2 text-center"
                      {...formik.getFieldProps("securityCode")}
                    />
                    {formik.touched.securityCode && formik.errors.securityCode ? (
                      <div className="text-red-600 text-sm">{formik.errors.securityCode}</div>
                    ) : null}
                  </div>
                </div>

                {/* Se isLoading for true → O botão fica desativado e exibe um GIF de carregamento
                    Se isLoading for false → O botão volta ao normal */}
                {isLoading ? (
                  // Botão para envio do formulário
                  <button
                    type="button"
                    disabled={true}
                    className="p-2 w-32 bg-gray-600 text-white rounded-full flex justify-center"
                  >
                    <img src={loading} alt="" className="h-7" />
                  </button>
                ) : (
                  <button type="submit" className="p-3 w-32 bg-green-900 text-white rounded-md">
                    Cadastrar
                  </button>
                )}
              </form>
            )}
          </Formik>
        </section>
      </main>

      <ToastContainer />
    </>
  );
};

export default NewCardForm;
