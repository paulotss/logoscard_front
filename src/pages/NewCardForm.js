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
      await axios.post('/', {
        holder: values.holder,
        number: values.number,
        expMonth: values.expMonth,
        expYear: values.expYear,
        securityCode: values.securityCode,
      });
      navigate('/clients')
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Header />
      <main className="p-5">
        <section>

        {/* Verificar o tipo dos dados na API */}

          <Formik
            initialValues={{
              holder: "",
              number: "",
              expMonth: "",
              expYear: "",
              securityCode: "",
            }}
            validationSchema={Yup.object({
              holder: Yup.string().required('Obrigatório'),
              number: Yup.string().required('Obrigatório'),
              expMonth: Yup.string().required('Obrigatório'),
              expYear: Yup.string().required('Obrigatório'),
              securityCode: Yup.string().required('Obrigatório'),

            })}
            onSubmit={submitForm}
          >
            {
              formik => (
                <form
                  className="md:w-[70%]"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="mb-5">
                    <label htmlFor="holder">Titular</label>
                    <br/>
                    <input
                      id="holder"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('holder')}
                    />
                    {formik.touched.holder && formik.errors.holder ? (
                      <div className="text-red-600 text-sm">{formik.errors.holder}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="number">Número do cartão</label>
                    <br/>
                    <input
                      id="number"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('number')}
                    />
                    {formik.touched.number && formik.errors.number ? (
                      <div className="text-red-600 text-sm">{formik.errors.number}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="expMonth">Mês de vencimento</label>
                    <br/>
                    <input
                      id="expMonth"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('expMonth')}
                    />
                    {formik.touched.expMonth && formik.errors.expMonth ? (
                      <div className="text-red-600 text-sm">{formik.errors.expMonth}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="expYear">Ano de vencimento</label>
                    <br/>
                    <input
                      id="expYear"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('expYear')}
                    />
                    {formik.touched.expYear && formik.errors.expYear ? (
                      <div className="text-red-600 text-sm">{formik.errors.expYear}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="securityCode">Código de segurança</label>
                    <br/>
                    <input
                      id="securityCode"
                      type="securityCode"
                      className="w-full p-2"
                      {...formik.getFieldProps('securityCode')}
                    />
                    {formik.touched.securityCode && formik.errors.securityCode ? (
                      <div className="text-red-600 text-sm">{formik.errors.securityCode}</div>
                    ) : null}
                  </div>

                  {
                    isLoading
                    ? <button
                        type="button"
                        disabled={true}
                        className="p-2 w-24 bg-gray-600 text-white rounded-full flex justify-center"
                      >
                        <img src={loading} alt="" className="h-7" />
                      </button>
                    : <button
                        type="submit"
                        className="p-3 w-24 bg-green-900 text-white rounded-md"
                      >
                        Cadastrar
                      </button>
                  }
                </form>
              )
            }
          </Formik>
        </section>
      </main>
    </>
  )
}

export default NewCardForm;