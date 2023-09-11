import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Dialog, DialogContent } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

const AddDependent = ({ setDependents }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [birthday, setBirthday] = useState(dayjs());

  const submitForm = (values) => {
    setDependents({ ...values, birthday });
    setIsShowing(false);
  }

  return (
    <>
      <button
        type='button'
        className="p-2 bg-green-600 text-white rounded-md mb-2"
        onClick={() => { setIsShowing(true) }}
      >
        <AddBoxIcon /> <span className="text-sm">Adicionar</span>
      </button>
      <Dialog open={isShowing} onClose={() => { setIsShowing(false) }} fullWidth={true}>
        <DialogContent>
        <h1 className="font-bold mb-5 text-xl">Adicionar dependente</h1>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              cellPhone: "",
              email: "",
              password: "",
              rg: "",
              cpf: "",
              accessLevel: 3,
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
                >
                  <div className="mb-2">
                    <label htmlFor='firstName'>Nome</label>
                    <input
                      type='text'
                      id='lastName'
                      className='w-full p-1 border'
                      { ...formik.getFieldProps('firstName') }
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                      <div className="text-red-600 text-xs">{formik.errors.firstName}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="lastName">Sobrenome</label>
                    <br/>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full p-1 border"
                      {...formik.getFieldProps('lastName')}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <div className="text-red-600 text-xs">{formik.errors.lastName}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="email">Email</label>
                    <br/>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-1 border"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600 text-xs">{formik.errors.email}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="cellPhone">Celular</label>
                    <br/>
                    <input
                      id="cellPhone"
                      type="text"
                      className="w-full p-1 border"
                      {...formik.getFieldProps('cellPhone')}
                    />
                    {formik.touched.cellPhone && formik.errors.cellPhone ? (
                      <div className="text-red-600 text-xs">{formik.errors.cellPhone}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="password">Senha</label>
                    <br/>
                    <input
                      id="password"
                      type="password"
                      className="w-full p-1 border"
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-600 text-xs">{formik.errors.password}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="rg">RG</label>
                    <br/>
                    <input
                      id="rg"
                      type="text"
                      className="w-full p-1 border"
                      {...formik.getFieldProps('rg')}
                    />
                    {formik.touched.rg && formik.errors.rg ? (
                      <div className="text-red-600 text-xs">{formik.errors.rg}</div>
                    ) : null}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="cpf">CPF</label>
                    <br/>
                    <input
                      id="cpf"
                      type="text"
                      className="w-full p-1 border"
                      {...formik.getFieldProps('cpf')}
                    />
                    {formik.touched.cpf && formik.errors.cpf ? (
                      <div className="text-red-600 text-xs">{formik.errors.cpf}</div>
                    ) : null}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="cpf">Data de nascimento</label>
                    <br/>
                    <DatePicker
                      value={birthday}
                      format="DD/MM/YYYY"
                      onChange={(v) => {setBirthday(v) }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="p-2 w-24 bg-green-600 text-white rounded-md"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="p-2 w-24 bg-gray-500 text-white rounded-md ml-2"
                    onClick={() => { setIsShowing(false) }}
                  >
                    Fechar
                  </button>
                </form>
              )
            }
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddDependent;