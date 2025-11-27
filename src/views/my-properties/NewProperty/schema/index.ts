import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  step1: Yup.object().shape({
    customerId: Yup.string().required('Este campo es requerido'),
    typeOfOperationId: Yup.string().required('Este campo es requerido'),
    timeAvailable: Yup.object().shape({
      start: Yup.date().nullable(),
      end: Yup.date().nullable(),
    }),
    typeOfPropertyId: Yup.string().required('Este campo es requerido'),
    currencyId: Yup.string().required('Este campo es requerido'),
    propertyPrice: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser un número positivo')
      .required('Este campo es requerido'),
  }),
  step2: Yup.object().shape({
    highlighted: Yup.boolean().optional(),
    observations: Yup.string()
      .nullable()
      .notRequired()
      .trim()
      .max(5120, 'No puede exceder los 5120 caracteres.'),
    characteristics: Yup.object().shape({
      surface: Yup.string().optional(),
      constructedSurface: Yup.string()
        .optional()
        .test(
          'is-less-than-surface',
          'La superficie construida no puede ser mayor que la superficie de terreno',
          function (value) {
            const { surface } = this.parent
            if (!surface || !value) return true
            return Number(value) <= Number(surface)
          }
        ),
      // surface: Yup.string().optional(),
      // constructedSurface: Yup.string().optional(),
      floors: Yup.string().optional(),
      numberOfFloors: Yup.string().optional(),
      terraces: Yup.string().optional(),
      bathrooms: Yup.string().optional(),
      bedrooms: Yup.string().optional(),
      hasKitchen: Yup.boolean().optional(),
      typeOfKitchen: Yup.string().optional(),
      hasHeating: Yup.boolean().optional(),
      typeOfHeating: Yup.string().optional(),
      hasAirConditioning: Yup.boolean().optional(),
      hasParking: Yup.boolean().optional(),
      hasGarage: Yup.boolean().optional(),
      numberOfParkingSpaces: Yup.string().optional().nullable(),
      hasElevator: Yup.boolean().optional(),
      hasGym: Yup.boolean().optional(),
      hasSwimmingPool: Yup.boolean().optional(),
      hasSecurity: Yup.boolean().optional(),
      typeOfSecurity: Yup.array().optional(),
      locatedInCondominium: Yup.boolean().optional(),
      isFurnished: Yup.boolean().optional(),
      hasBarbecueArea: Yup.boolean().optional(),
      propertyTitle: Yup.string().required('Este campo es requerido'),
      propertyDescription: Yup.string(),
      numberOfPrivate: Yup.string(),
      numberOfVacantFloors: Yup.string(),
      numberOfMeetingRooms: Yup.string(),
      hasKitchenet: Yup.boolean(),
      hasHouse: Yup.boolean(),
      locatedInGallery: Yup.boolean(),
      locatedFacingTheStreet: Yup.boolean(),
      floorLevelLocation: Yup.string(),
      officeNumber: Yup.string(),
      commonExpenses: Yup.string(),
    }),
    externalLink: Yup.string()
      .nullable()
      .matches(
        /^https:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/,
        'La URL debe ser válida y comenzar con https://. Ejemplo: https://www.portal.cl'
      )
      .notRequired(),
  }),
  step3: Yup.object().shape({
    countryId: Yup.number().required('Este campo es requerido'),
    stateId: Yup.number().required('Este campo es requerido'),
    cityId: Yup.number().required('Este campo es requerido'),
    address: Yup.string(),
    number: Yup.string().optional(),
    letter: Yup.string().optional(),
    references: Yup.string().optional(),
    addressPublic: Yup.string().required('Este campo es requerido'),
  }),
  step4: Yup.object().shape({
    isExchanged: Yup.boolean().optional(),
    timeInExchange: Yup.object().shape({
      start: Yup.date().nullable(),
      end: Yup.date().nullable(),
    }),
    propertyDescriptionInExchange: Yup.string().optional(),
  }),
})
