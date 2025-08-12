import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es requerido.'),
  lastName: Yup.string().required('Este campo es requerido.'),
  rut: Yup.string().optional(),
  phone: Yup.string()
    .required('Este campo es requerido.')
    .matches(
      /^[0-9]{1,9}$/,
      'El número de teléfono debe contener solo números y no exceder 9 dígitos.'
    ),
  dialCodeId: Yup.string().optional(),
  email: Yup.string()
    .email('Formato del correo incorrecto.')
    .required('Este campo es requerido.')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'El correo electrónico no es válido.'
    ),
  address: Yup.object().shape({
    countryId: Yup.number().required('Este campo es requerido.'),
    stateId: Yup.number().required('Este campo es requerido.'),
    cityId: Yup.number().required('Este campo es requerido.'),
    street: Yup.string().optional(),
  }),
})
