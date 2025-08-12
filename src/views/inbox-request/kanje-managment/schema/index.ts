import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  requestId: Yup.number().required('Este campo es requerido'),
  statusId: Yup.number().required('Este campo es requerido') || null,
})

const validationRatingSchema = Yup.object().shape({
  comment: Yup.string().required('Debes ingresar como mínimo un mensaje.'),
  rating: Yup.number().optional(),
  userId: Yup.number().optional(),
})

export { validationRatingSchema, validationSchema }
