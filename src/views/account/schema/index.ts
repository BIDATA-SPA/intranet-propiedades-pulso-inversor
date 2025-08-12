import * as Yup from 'yup'

const validationSchema = Yup.object().shape({})

const validationEditSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es requerido'),
  lastName: Yup.string().required('Este campo es requerido'),
  phone: Yup.string().optional(),
  dialCodeId: Yup.string().optional(),
  webPage: Yup.string()
    .nullable()
    .matches(
      /^https:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/,
      'La URL debe ser válida y comenzar con https://. Ejemplo: https://www.ejemplo.cl'
    )
    .notRequired(),
})

const validationPreferenceAddressSchema = Yup.object().shape({
  preferences: Yup.array()
    .of(
      Yup.object().shape({
        countryId: Yup.number().required('Seleccione un País'),
        stateId: Yup.number().required('Seleccione una Región'),
        cityId: Yup.number().required('Seleccione una Comuna'),
      })
    )
    .max(5, 'Solo puede seleccionar hasta 5 comunas de preferencia'),
})

export {
  validationEditSchema,
  validationPreferenceAddressSchema,
  validationSchema,
}
