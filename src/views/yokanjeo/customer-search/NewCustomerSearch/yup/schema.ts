import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  customerId: Yup.number().required('Este campo es requerido.'),
  typeOfOperationId: Yup.string().required('Este campo es requerido.'),
  typeOfPropertyId: Yup.string().required('Este campo es requerido.'),
  currencyId: Yup.string().required('Este campo es requerido.'),
  propertyPrice: Yup.object().shape({
    min: Yup.number()
      .min(0, 'Precio menor a 0.')
      .required('Este campo es requerido.')
      .test(
        'is-less-than-max',
        'El mínimo debe ser menor que el máximo.',
        function (value) {
          const { max } = this.parent
          return !max || value < max
        }
      ),
    max: Yup.number()
      .required('Este campo es requerido.')
      .test(
        'is-greater-than-min',
        'El precio máximo debe ser mayor que el precio mínimo.',
        function (value) {
          const { min } = this.parent
          return !min || value > min
        }
      ),
  }),
  bedrooms: Yup.string(),
  bathrooms: Yup.string(),
  locatedInCondominium: Yup.boolean(),
  hasSecurity: Yup.boolean(),
  hasParking: Yup.boolean(),
  hasSwimmingPool: Yup.boolean(),
  address: Yup.object().shape({
    street: Yup.string().optional(),
    countryId: Yup.number().optional(),
    stateId: Yup.number().optional(),
    cityId: Yup.number().optional(),
  }),
})
