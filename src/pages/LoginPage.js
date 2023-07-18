import axios from "../http";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginPage = () => {
  const navigate = useNavigate();

  const submitForm = async (values) => {
    try {
      const result = await axios.post('/login', { ...values, admin: true });
      sessionStorage.setItem('auth', result.data.token);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="flex flex-col justify-center m-20">
      <h1 className="font-bold text-2xl mb-2">Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string().email("Email inválido").required("Obrigatório"),
          password: Yup.string().min(6, "Mínimo de 6 carateres").required("Obrigatório"),
        })}
        onSubmit={submitForm}
      >
        {
          formik => (
            <form
              className="border p-3 border-gray-400 w-96"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="email"
                  id="email"
                  className="border p-1 w-full"
                  { ...formik.getFieldProps("email") }
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600 text-sm">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label htmlFor="password">Senha</label>
                <br />
                <input
                  type="password"
                  id="password"
                  className="border p-1 w-full"
                  { ...formik.getFieldProps("password") }
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-600 text-sm">{formik.errors.password}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="p-2 bg-gray-900 text-white"
              >
                Entrar
              </button>
            </form>
          )
        }
      </Formik>
    </main>
  )
}

export default LoginPage;
