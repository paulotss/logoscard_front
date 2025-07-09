/* global PagSeguro */

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../http";
import loading from "../media/isLoading.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const NewCardForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pagSeguroReady, setPagSeguroReady] = useState(false);
  const { token } = useParams();
  const [user, setUser] = useState({});
  const [isValidToken, setIsValidToken] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const navigate = useNavigate();

  // Carrega o SDK quando o componente é montado
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js";
    script.async = true;
    script.onload = () => {
      setPagSeguroReady(true);
      console.log("PagSeguro SDK carregado!");
    };
    script.onerror = (err) => {
      console.error("Erro ao carregar PagSeguro SDK:", err);
      toast.error("Erro ao carregar sistema de pagamento");
    };
    document.body.appendChild(script);

    const validateTokenAndGetUser = async () => {
      setIsLoading(true);
      try {
        // Validate token and get user data in one secure request
        const result = await axios.post(`/card/validate-token`, {
          token: token,
        });

        if (result.data.isValid) {
          setUser(result.data.user);
          setIsValidToken(true);
        } else {
          toast.error("Link inválido ou expirado");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        if (error.response?.status === 429) {
          setRateLimitError(true);
          toast.error("Muitas tentativas. Tente novamente em alguns minutos.");
        } else {
          toast.error("Link inválido ou expirado");
          setTimeout(() => navigate("/"), 3000);
        }
      }
      setIsLoading(false);
    };

    validateTokenAndGetUser();
  }, [token, navigate]);

  // Garantir que o script do PagSeguro foi carregado
  const submitForm = async (values) => {
    if (!pagSeguroReady) {
      toast.error("Sistema de pagamento não carregado. Tente novamente.");
      return;
    }
    setIsLoading(true);

    try {
      // Criptografa os dados do cartão usando a chave obtida do backend
      const card = PagSeguro.encryptCard({
        publicKey:
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw0nc7xP2/MHB6AHbXle7xcwFky3hduqi383UwkjKYEADWThiFPa1tUnAAxzHJDhDYyDtssHsiuUE/GR0Q19ZdfRvfaSYk0sZTuzLU7mE6ilOis7J2jdB6QqZyqFxZ6Y4w8md8CRDrFr45p6WCo9T3VsWnOYhHaT4pcUsfxnSDkKfDHOcAzr6BMPKroacQPv/D7AOVrCwTY14dHcMfyTzfqhhHf2XayzSu3OQi0Jwx9vSDT4a+N7BCCCub7n1o7O0GzlX9N2Mbdw2Y+VwvyE5bICynr6PD/9uPkRsp+kaK+UJsZ1ulQPFsVkFjbJBAqFHANvDll3JJ/kPanR30AcQ1QIDAQAB",
        holder: values.holder,
        number: values.number,
        expMonth: values.expMonth,
        expYear: values.expYear,
        securityCode: values.securityCode,
      });

      // Verificar erros na criptografia do cartão
      if (card.hasErrors) {
        toast.error("Erro ao processar dados do cartão");
        setIsLoading(false);
        return;
      }

      // Envia os dados criptografados para a API incluindo o token
      const customerData = {
        name: user.firstName,
        email: user.email,
        tax_id: user.cpf,
        phones: [
          {
            country: "55",
            area: user.cellPhone.substring(0, 2),
            number: user.cellPhone.substring(2),
          },
        ],
        birth_date: user.birthday.split("T")[0],
        billing_info: [
          {
            card: {
              holder: {
                phone: {
                  country: "55",
                  area: user.cellPhone.substring(0, 2),
                  number: user.cellPhone.substring(2),
                },
                name: user.firstName,
                birth_date: user.birthday.split("T")[0],
                tax_id: user.cpf,
              },
              encrypted: card.encryptedCard,
            },
            type: "CREDIT_CARD",
          },
        ],
        token: token, // Include token for server-side validation
      };

      const customerResponse = await axios.post(
        "/signature/customers",
        customerData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const customerId = customerResponse.data.id;

      // Criar plano
      const planData = {
        amount: { currency: "BRL", value: 200000 },
        interval: { unit: "MONTH", length: 1 },
        trial: { enabled: false, hold_setup_fee: false, days: 0 },
        reference_id: "id_plano_test",
        name: "Plano Teste",
        description: "Plano para teste",
      };

      const planResponse = await axios.post("/signature/plans", planData, {
        headers: { "Content-Type": "application/json" },
      });

      const planId = planResponse.data.id;

      // Criar assinatura
      const subscriptionData = {
        plan: { id: planId },
        customer: { id: customerId },
        payment_method: [
          {
            type: "CREDIT_CARD",
            card: { security_code: values.securityCode },
          },
        ],
        pro_rata: false,
        split_enabled: false,
        reference_id: "id_assinatura",
        token: token, // Include token for server-side validation
      };

      await axios.post("/signature/subscription", subscriptionData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Cartão cadastrado com sucesso!");

      // Invalidate token after successful submission
      await axios.post("/card/invalidate-token", { token });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro na requisição:", error);

      // Don't expose detailed error messages to the user
      if (error.response?.status === 400) {
        toast.error("Dados inválidos. Verifique as informações do cartão.");
      } else if (error.response?.status === 429) {
        toast.error("Muitas tentativas. Tente novamente em alguns minutos.");
      } else {
        toast.error("Erro ao processar pagamento. Tente novamente.");
      }
    }

    // Reativa o botão de envio
    setIsLoading(false);
  };

  // Show loading or error states
  if (rateLimitError) {
    return (
      <>
        <Header hideNav={true} />
        <main className="p-5 flex justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Acesso Temporariamente Bloqueado
            </h2>
            <p className="text-gray-600">
              Muitas tentativas foram detectadas. Tente novamente em alguns
              minutos.
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!isValidToken && !isLoading) {
    return (
      <>
        <Header hideNav={true} />
        <main className="p-5 flex justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Link Inválido ou Expirado
            </h2>
            <p className="text-gray-600">
              Este link não é mais válido. Solicite um novo link.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Carrega o componente de tela Header */}
      <Header hideNav={true} />

      {/* Bloco principal, container mais externo */}
      <main className="p-5 flex justify-center">
        {/* Seção que agrupa o formulário, está dentro da main */}
        <section className="w-full max-w-md">
          {isLoading && !isValidToken ? (
            <div className="flex justify-center">
              <img src={loading} alt="Carregando..." className="h-16" />
            </div>
          ) : (
            /*componente da biblioteca Formik que facilita a criação e gerenciamento de formulários */
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
                holder: Yup.string()
                  .min(3, "Nome muito curto")
                  .max(50, "Nome muito longo")
                  .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras")
                  .required("Obrigatório"),
                number: Yup.string()
                  .matches(
                    /^\d{14,19}$/,
                    "Número do cartão deve ter entre 14 e 19 dígitos"
                  )
                  .required("Obrigatório"),
                expMonth: Yup.string()
                  .matches(
                    /^(0[1-9]|1[0-2])$/,
                    "Informe um valor entre 01 e 12"
                  )
                  .required("Obrigatório"),
                expYear: Yup.string()
                  .matches(/^(2\d{3}|\d{2})$/, "Ano inválido")
                  .test("future-date", "Cartão expirado", function (value) {
                    const month = this.parent.expMonth;
                    if (!value || !month) return true;

                    const year = value.length === 2 ? `20${value}` : value;
                    const expDate = new Date(year, month - 1);
                    return expDate > new Date();
                  })
                  .required("Obrigatório"),
                securityCode: Yup.string()
                  .matches(/^\d{3,4}$/, "Código inválido")
                  .required("Obrigatório"),
              })}
              onSubmit={submitForm}
            >
              {(formik) => (
                // Formulário dentro da section
                <form
                  className="flex flex-col items-center"
                  onSubmit={formik.handleSubmit}
                >
                  {/* Várias div com os inputs do formulário estilizados com Tailwind*/}
                  <div className="mb-5 w-full text-center">
                    <label htmlFor="holder" className="block">
                      Titular
                    </label>
                    <input
                      id="holder"
                      type="text"
                      className="w-full p-2 text-center border rounded-md"
                      autoComplete="cc-name"
                      {...formik.getFieldProps("holder")}
                    />
                    {formik.touched.holder && formik.errors.holder ? (
                      <div className="text-red-600 text-sm">
                        {formik.errors.holder}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-5 w-full text-center">
                    <label htmlFor="number" className="block">
                      Número do cartão
                    </label>
                    <input
                      id="number"
                      type="text"
                      className="w-full p-2 text-center border rounded-md"
                      autoComplete="cc-number"
                      {...formik.getFieldProps("number")}
                    />
                    {formik.touched.number && formik.errors.number ? (
                      <div className="text-red-600 text-sm">
                        {formik.errors.number}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-5 flex gap-3 w-full justify-center">
                    <div className="w-1/3 text-center">
                      <label htmlFor="expMonth" className="block">
                        Mês
                      </label>
                      <input
                        id="expMonth"
                        type="text"
                        className="w-full p-2 text-center border rounded-md"
                        autoComplete="cc-exp-month"
                        {...formik.getFieldProps("expMonth")}
                      />
                      {formik.touched.expMonth && formik.errors.expMonth ? (
                        <div className="text-red-600 text-sm">
                          {formik.errors.expMonth}
                        </div>
                      ) : null}
                    </div>

                    <div className="w-1/3 text-center">
                      <label htmlFor="expYear" className="block">
                        Ano
                      </label>
                      <input
                        id="expYear"
                        type="text"
                        className="w-full p-2 text-center border rounded-md"
                        autoComplete="cc-exp-year"
                        {...formik.getFieldProps("expYear")}
                      />
                      {formik.touched.expYear && formik.errors.expYear ? (
                        <div className="text-red-600 text-sm">
                          {formik.errors.expYear}
                        </div>
                      ) : null}
                    </div>

                    <div className="w-1/3 text-center">
                      <label htmlFor="securityCode" className="block">
                        CVV
                      </label>
                      <input
                        id="securityCode"
                        type="password"
                        className="w-full p-2 text-center border rounded-md"
                        autoComplete="cc-csc"
                        {...formik.getFieldProps("securityCode")}
                      />
                      {formik.touched.securityCode &&
                      formik.errors.securityCode ? (
                        <div className="text-red-600 text-sm">
                          {formik.errors.securityCode}
                        </div>
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
                      <img src={loading} alt="Processando..." className="h-7" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="p-3 w-32 bg-green-900 text-white rounded-md hover:bg-green-800"
                    >
                      Cadastrar
                    </button>
                  )}
                </form>
              )}
            </Formik>
          )}
        </section>
      </main>

      <ToastContainer />
    </>
  );
};

export default NewCardForm;
