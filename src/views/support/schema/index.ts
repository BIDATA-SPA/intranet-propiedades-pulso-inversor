import * as Yup from 'yup'

const RUT_REGEX = /^\d{2}\.\d{3}\.\d{3}-[0-9Kk]$/

const validationSchema = Yup.object().shape({
  categoryId:
    Yup.string().required('Este campo es requerido') ||
    Yup.number().required('Este campo es requerido'),
  rut: Yup.string()
    .matches(RUT_REGEX, 'El formato del RUT no es válido.')
    .optional(),
  comment: Yup.string(),
})

export { validationSchema }
