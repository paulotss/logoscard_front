import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../http";
import loading from "../media/isLoading.gif";

const NewCardForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitForm = async (values) => {
    setIsLoading(true);
    try {
      await axios.post("/", {
        holder: values.holder,
        number: values.number,
        expMonth: values.expMonth,
        expYear: values.expYear,
        securityCode: values.securityCode,
      });
      navigate("/clients");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header hideNav={true} />
      <main className="p-5 flex justify-center">
        <section className="w-full max-w-md">
          <Formik
            initialValues={{
              holder: "",
              number: "",
              expMonth: "",
              expYear: "",
              securityCode: "",
            }}
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
              <form className="flex flex-col items-center" onSubmit={formik.handleSubmit}>
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
                      type="text"
                      className="w-full p-2 text-center"
                      {...formik.getFieldProps("securityCode")}
                    />
                    {formik.touched.securityCode && formik.errors.securityCode ? (
                      <div className="text-red-600 text-sm">{formik.errors.securityCode}</div>
                    ) : null}
                  </div>
                </div>

                {isLoading ? (
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
    </>
  );
};

export default NewCardForm;
