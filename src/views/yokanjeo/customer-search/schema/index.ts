import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es requerido.'),
  lastName: Yup.string().required('Este campo es requerido.'),
  to: Yup.string()
    .email('Formato e-mail incorrecto.')
    .required('Este campo es requerido.'),
  propertyId: Yup.string(),
  phone: Yup.string(),
  realtorFrom: Yup.string()
    .email('Formato e-mail incorrecto.')
    .required('Este campo es requerido.'),
  subject: Yup.string().required('Este campo es requerido.'),
  message: Yup.string().required('Este campo es requerido.'),
})
