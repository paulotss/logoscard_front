import useValidateImage from "../hooks/useValidateImage";
import Header from "../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../http";

const NewClientForm = () => {
  const { image, message, handleChangeFile } = useValidateImage();

  const submitForm = async (values) => {
    const result = await axios.post('/user', {
      ...values,
      photo: image.photo,
      file: image.file,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log(result.data);
    console.log(values);
    console.log(image);
  }

  return (
    <>
      <Header />
      <main className="p-5">
        <section>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              rg: "",
              cpf: "",
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().required('Obrigatório'),
              lastName: Yup.string().required('Obrigatório'),
              email: Yup.string().email('Email inválido').required('Obrigatório'),
              password: Yup.string().required('Obrigatório'),
              rg: Yup.string().required('Obrigatório'),
              cpf: Yup.string().required('Obrigatório'),
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
                    <label htmlFor="firstName">Nome</label>
                    <br/>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('firstName')}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                      <div className="text-red-600 text-sm">{formik.errors.firstName}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="lastName">Sobrenome</label>
                    <br/>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('lastName')}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <div className="text-red-600 text-sm">{formik.errors.lastName}</div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="photo">Foto de perfil</label>
                    <br/>
                    <input
                      id="photo"
                      type="file"
                      name="photo"
                      onChange={handleChangeFile}
                      accept="image/png, image/jpeg"
                    />
                    {
                      image.preview ?
                      <img
                        src={image.preview}
                        alt=""
                        className="w-24 border-2 border-green-900 mt-2"
                      /> :
                      <div className="text-red-600 text-sm">{message}</div>
                    }
                  </div>

                  <div className="mb-5">
                    <label htmlFor="email">Email</label>
                    <br/>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600 text-sm">{formik.errors.email}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="password">Senha</label>
                    <br/>
                    <input
                      id="password"
                      type="password"
                      className="w-full p-2"
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-600 text-sm">{formik.errors.password}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="rg">RG</label>
                    <br/>
                    <input
                      id="rg"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('rg')}
                    />
                    {formik.touched.rg && formik.errors.rg ? (
                      <div className="text-red-600 text-sm">{formik.errors.rg}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="cpf">CPF</label>
                    <br/>
                    <input
                      id="cpf"
                      type="text"
                      className="w-full p-2"
                      {...formik.getFieldProps('cpf')}
                    />
                    {formik.touched.cpf && formik.errors.cpf ? (
                      <div className="text-red-600 text-sm">{formik.errors.cpf}</div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="p-3 bg-green-900 text-white rounded-full"
                  >
                    Cadastrar
                  </button>
                </form>
              )
            }
          </Formik>
        </section>
      </main>
    </>
  )
}

export default NewClientForm;