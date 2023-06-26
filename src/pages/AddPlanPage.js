import { Formik } from "formik";
import * as Yup from "yup";

const AddPlanPage = () => {
  const submitForm = async (values) => {
    console.log(values)
  }
  return (
    <main className="p-3">
      <p className="font-bold mb-3">Adicionar plano</p>
      <Formik
        initialValues={{
          expiration: "",
          parcels: "",
        }}
        validationSchema={Yup.object({
          expiration: Yup
          .string()
          .max(2)
          .matches(/\b([1-9]|[12][0-8])\b/, "Somente números de 1 a 28")
          .required("Obrigatório"),
        })}
        onSubmit={submitForm}
      >
        {
          formik => (
            <form>
              <div className="mb-3">
                <p className="mb-3">Valor do plano: </p>
                <label htmlFor="expiration">Dia de vencimento: </label>
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
                type="button"
                className="bg-green-900 p-2 text-center rounded-full text-white"
              >
                Adicionar
              </button>
            </form>
          )
        }
      </Formik>
    </main>
  )
}

export default AddPlanPage;