import axios from "../http";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import logo from '../media/logo1.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const submitForm = async (values) => {
    try {
      const result = await axios.post('/login', { ...values });
      sessionStorage.setItem('auth', result.data);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="flex flex-col justify-center m-20">
      <div className="w-fit self-center"><img src={logo} alt="logo" /></div>
      <h1 className="self-center font-bold text-xl mb-2 text-[#1C232E]">Login</h1>
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
              className="self-center border-2 border-[#288D85] p-5 border-gray-400 w-80 rounded-md"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-3">
                <label className="text-[#288D85] text-sm" htmlFor="email">Email</label>
                <br />
                <input
                  type="email"
                  id="email"
                  className="border p-1 w-full"
                  { ...formik.getFieldProps("email") }
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600 text-xs">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label className="text-[#288D85] text-sm" htmlFor="password">Senha</label>
                <br />
                <input
                  type="password"
                  id="password"
                  className="border p-1 w-full"
                  { ...formik.getFieldProps("password") }
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-600 text-xs">{formik.errors.password}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="p-2 bg-[#288D85] text-white rounded-md w-24"
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
