import * as Yup from 'yup'

export const validationRatingSchema = Yup.object().shape({
  comment: Yup.string().required('Debes ingresar como mínimo un mensaje.'),
  rating: Yup.number().optional(),
  userId: Yup.number().optional(),
})
