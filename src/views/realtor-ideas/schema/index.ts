import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  description: Yup.string(),
})

export { validationSchema }
