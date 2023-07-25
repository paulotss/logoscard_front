import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const AddDependent = ({ setDependents, dependents }) => {
  const [ isShowing, setIsShowing ] = useState(false);

  const submitForm = (values) => {
    setDependents([...dependents, values]);
    setIsShowing(false);
  }

  if (!isShowing) {
    return (
      <button
        type='button'
        className="p-2 bg-green-600 text-white rounded-full mb-2"
        onClick={() => { setIsShowing(true) }}
      >
        Adicionar dependente
      </button>
    )
  }

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        cellPhone: "",
        email: "",
        password: "",
        rg: "",
        cpf: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string().required('Obrigatório'),
        lastName: Yup.string().required('Obrigatório'),
        cellPhone: Yup.string().required('Obrigatório'),
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
            onSubmit={formik.handleSubmit}
            className="border-2 p-3 border-green-600"
          >
            <div className="mb-2">
              <label htmlFor='firstName'>Nome</label>
              <input
                type='text'
                id='lastName'
                className='w-full p-1'
                { ...formik.getFieldProps('firstName') }
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-600 text-sm">{formik.errors.firstName}</div>
              ) : null}
            </div>

            <div className="mb-2">
              <label htmlFor="lastName">Sobrenome</label>
              <br/>
              <input
                id="lastName"
                type="text"
                className="w-full p-1"
                {...formik.getFieldProps('lastName')}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-600 text-sm">{formik.errors.lastName}</div>
              ) : null}
            </div>

                  <div className="mb-2">
                    <label htmlFor="email">Email</label>
                    <br/>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-1"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600 text-sm">{formik.errors.email}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="cellPhone">Celular</label>
                    <br/>
                    <input
                      id="cellPhone"
                      type="text"
                      className="w-full p-1"
                      {...formik.getFieldProps('cellPhone')}
                    />
                    {formik.touched.cellPhone && formik.errors.cellPhone ? (
                      <div className="text-red-600 text-sm">{formik.errors.cellPhone}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="password">Senha</label>
                    <br/>
                    <input
                      id="password"
                      type="password"
                      className="w-full p-1"
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-600 text-sm">{formik.errors.password}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="rg">RG</label>
                    <br/>
                    <input
                      id="rg"
                      type="text"
                      className="w-full p-1"
                      {...formik.getFieldProps('rg')}
                    />
                    {formik.touched.rg && formik.errors.rg ? (
                      <div className="text-red-600 text-sm">{formik.errors.rg}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="cpf">CPF</label>
                    <br/>
                    <input
                      id="cpf"
                      type="text"
                      className="w-full p-1"
                      {...formik.getFieldProps('cpf')}
                    />
                    {formik.touched.cpf && formik.errors.cpf ? (
                      <div className="text-red-600 text-sm">{formik.errors.cpf}</div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="p-2 w-24 bg-green-600 text-white rounded-full"
                  >
                    Cadastrar
                  </button>
                  <button
                    type="button"
                    className="p-2 w-24 bg-gray-500 text-white rounded-full ml-2"
                    onClick={() => { setIsShowing(false) }}
                  >
                    Fechar
                  </button>
          </form>
        )
      }
    </Formik>
  );
}

export default AddDependent;