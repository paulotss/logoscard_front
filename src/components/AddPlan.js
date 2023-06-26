import { useEffect, useState } from "react";
import { Formik } from "formik";
import axios from "../http";
import * as Yup from "yup";
import loading from "../media/isLoading.gif";

const AddPlan = (props) => {
  const { submitPlanForm, setIsShowingAddPlans } = props;
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPriceById = (idPlan) => {
    const plan = plans.find((plan) => plan.id === Number(idPlan));
    return "R$ " + plan.price.toLocaleString('pt-br', {minimumFractionDigits: 2});
  }

  useEffect(() => { 
    const getPlans = async () => {
      setIsLoading(true);
      try {
        const result = await axios.get('/plans');
        setPlans(result.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    getPlans();
  }, []);

  return (
    <main className="p-3">
      {
        isLoading
        ? <div className="w-full flex justify-center">
            <img src={loading} alt="" />
          </div>
        : <>
            <p className="font-bold mb-3">Adicionar plano</p>
            <Formik
              initialValues={{
                plan: "1",
                expiration: "",
                parcels: "1x",
              }}
              validationSchema={Yup.object({
                expiration: Yup
                .string()
                .max(2)
                .matches(/\b([1-9]|[12][0-8])\b/, "Somente números de 1 a 28")
                .required("Obrigatório"),
              })}
              onSubmit={submitPlanForm}
            >
              {
                formik => (
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="plan">Plano: </label>
                      <select id="plan" className="p-2" {...formik.getFieldProps('plan')}>
                        {
                          plans.map((plan) => (
                            <option value={plan.id} key={plan.id}>{plan.title}</option>
                          ))
                        }
                      </select>
                      <p>
                        Expira em: 
                        {
                          `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear() + 1}`
                        }
                      </p>
                      <p className="mb-3">Valor do plano: { getPriceById(formik.values.plan) } </p>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="expiration">Dia de vencimento da fatura: </label>
                      <input
                        id="expiration"
                        type="text"
                        className="w-12 p-2"
                        {...formik.getFieldProps('expiration')}
                      />
                      {formik.touched.expiration && formik.errors.expiration ? (
                        <div className="text-red-600 text-sm">{formik.errors.expiration}</div>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="parcels">Parcelas: </label>
                      <select
                        id="parcels"
                        className="p-2 mb-3"
                        {...formik.getFieldProps('parcels')}
                      >
                        <option>1x</option>
                        <option>2x</option>
                        <option>3x</option>
                        <option>4x</option>
                        <option>5x</option>
                        <option>6x</option>
                        <option>7x</option>
                        <option>8x</option>
                        <option>9x</option>
                        <option>10x</option>
                        <option>11x</option>
                        <option>12x</option>
                      </select>
                      {formik.touched.parcels && formik.errors.parcels ? (
                        <div className="text-red-600 text-sm">{formik.errors.parcels}</div>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="bg-green-900 p-2 text-center rounded-full text-white"
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsShowingAddPlans() }}
                      className="bg-gray-600 ml-2 p-2 text-center rounded-full text-white"
                    >
                      Fechar
                    </button>
                  </form>
                )
              }
            </Formik>
          </>
      }
      
    </main>
  )
}

export default AddPlan;