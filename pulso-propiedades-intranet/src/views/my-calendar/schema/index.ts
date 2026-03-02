import * as Yup from 'yup'

export const validationEventSchema = Yup.object().shape({
  eventType: Yup.string().optional(),
  title: Yup.string().required('Este campo es requerido'),
  start: Yup.date().optional(),
  end: Yup.date().optional(),
  startTime: Yup.date().optional(),
  endTime: Yup.date().optional(),
  description: Yup.string().optional(),
  eventColor: Yup.string().optional(),
})

export const validationVisitOrderSchema = Yup.object().shape({
  eventType: Yup.string().optional(),
  title: Yup.string().required('Este campo es requerido'),
  start: Yup.date().optional(),
  end: Yup.date().optional(),
  startTime: Yup.date().optional(),
  endTime: Yup.date().optional(),
  description: Yup.string().optional(),
  eventColor: Yup.string().optional(),
  customerId: Yup.number().optional(),
  propertyId: Yup.number().optional(),
  alias: Yup.string().optional(),
})
