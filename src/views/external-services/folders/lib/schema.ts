import * as Yup from 'yup'

// POST schema
const validationSchema = Yup.object().shape({
  to: Yup.string()
    .email('Debe ser un correo electrónico válido')
    .required('Este campo es requerido.')
    .min(1, 'Debes proporcionar al menos un correo electrónico')
    .required('Debes proporcionar al menos un correo electrónico'),
  customerId: Yup.number().required(),
  externalServiceId: Yup.number().required(),
  realtorFrom: Yup.string()
    .email('Formato e-mail incorrecto.')
    .required('Este campo es requerido.'),
  subject: Yup.string().required(),
  message: Yup.string(),
})

export { validationSchema }
