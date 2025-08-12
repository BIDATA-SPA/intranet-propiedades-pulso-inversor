import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string(),
  parentFolderId: Yup.number() || null,
  image: Yup.string() || null,
})

const validationUploadSchema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string(),
  folderId: Yup.number() || null,
  file: Yup.string() || null,
})

export { validationSchema, validationUploadSchema }
