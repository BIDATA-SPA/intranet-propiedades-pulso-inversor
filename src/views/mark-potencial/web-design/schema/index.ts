import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  startCampaign: Yup.boolean(),
  priceRangeId: Yup.number().required('Este campo es requerido'),
  startDateRangeId: Yup.number().required('Este campo es requerido'),
  toBeContacted: Yup.boolean(),
  serviceTypeId: Yup.number().required('Este campo es requerido'),
  statusId: Yup.number(),
  emailToSend: Yup.object().shape({
    to: Yup.string(),
    realtorFrom: Yup.string(),
    subject: Yup.string(),
    message: Yup.string(),
    cc: Yup.array().of(Yup.string()),
    requestingRealtorEmail: Yup.string(),
  }),
})

export { validationSchema }
