import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import { FormContainer, FormItem } from '@/components/ui/Form'
import hooks from '@/components/ui/hooks'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCustomersQuery,
  useGetAllPropertiesQuery,
} from '@/services/RtkQueryService'
import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik, useFormikContext } from 'formik'
import * as Yup from 'yup'

type FormModel = {
  title: string
  startDate: string | Date
  startTime: string
  endDate: string | Date
  endTime: string
  description: string
  eventColor: string
  eventType: string
  customerId?: number | null
  propertyId?: number | null

  propertyDirection: string
  propertyPrice?: number | null
  propertyPriceCode: string
  propertyCity: string,
  propertyRegion: string,
  clientName: string
  clientRut: string
  clientEmail: string
  clientPhone?: number | null
}

export type EventParam = {
  id: string
  title: string
  start: string
  startTime: string
  end: string
  endTime: string
  description: string
  eventColor: string
  eventType: string
  customerId?: number | null
  propertyId?: number | null

  propertyDirection: string
  propertyPrice?: number | null
  propertyPriceCode: string
  propertyCity: string,
  propertyRegion: string,
  clientName: string
  clientRut: string
  clientEmail: string
  clientPhone?: number | null
}

type EventDialogProps = {
  submit: (eventData: EventParam) => void
  propertyId: string
}

const { useUniqueId } = hooks

const eventTypes = [
  { value: 'visit order', label: 'Orden de Visita' },
]

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Este campo es requerido'),
})

const CustomerAutoFill = ({ customers }: { customers: any[] }) => {
  const { values, setFieldValue } = useFormikContext<FormModel>()

  useEffect(() => {
    const selected = customers?.find((c) => Number(c.id) === values.customerId)

    if (selected) {
      setFieldValue('clientName', `${selected.name} ${selected.lastName || ''}`)
      setFieldValue('clientRut', selected.rut || '')
      setFieldValue('clientEmail', selected.email || '')
      setFieldValue('clientPhone', selected.phone || '')
    } else {
      setFieldValue('clientName', '')
      setFieldValue('clientRut', '')
      setFieldValue('clientEmail', '')
      setFieldValue('clientPhone', '')
    }
  }, [values.customerId, customers, setFieldValue])

  return null
}

const PdfForm = ({ submit, propertyId }: EventDialogProps) => {
  const newId = useUniqueId('event-')

  const { data: customers } = useGetAllCustomersQuery(
    {
      page: 1,
      limit: 999999,
      search: '',
    },
    { refetchOnMountOrArgChange: false }
  )

  const { data: properties } = useGetAllPropertiesQuery({
    limit: 9999999,
    page: 1,
  })

  const propertyOptions =
    properties?.data
      ?.filter((property) => Number(property.id) === Number(propertyId))
      .map((property) => ({
        value: Number(property.id),
        label: `#(${property.id})  ${property.propertyTitle}`,
      })) || []

  const propertyData =
    properties?.data
      ?.filter((property) => Number(property.id) === Number(propertyId));

  const customerOptions =
    customers?.data?.map((customer) => ({
      value: Number(customer.id),
      label: `${customer.name} ${customer.lastName} ${
        customer.alias && `(${customer.alias})`
      }`,
    })) || []

  const handleSubmit = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(false)

    const combineDateAndTime = (date: Date | string, time: string): string => {
      return dayjs(date)
        .hour(Number(time.split(':')[0]))
        .minute(Number(time.split(':')[1]))
        .second(0)
        .millisecond(0)
        .toISOString()
    }

    const eventData: EventParam = {
      id: newId,
      title: values.title,
      start: combineDateAndTime(values.startDate, values.startTime),
      end: combineDateAndTime(values.endDate, values.endTime),
      startTime: combineDateAndTime(values.startDate, values.startTime),
      endTime: combineDateAndTime(values.endDate, values.endTime),
      description: values.description,
      eventColor: values.eventColor,
      eventType: values.eventType,
      customerId: Number(values?.customerId) || null,
      propertyId: Number(values?.propertyId) || null,
      propertyDirection: values.propertyDirection,
      propertyPrice: values.propertyPrice,
      propertyPriceCode: values.propertyPriceCode,
      propertyCity: values.propertyCity,
      propertyRegion:values.propertyRegion,
      clientName: values.clientName,
      clientRut: values.clientRut,
      clientEmail: values.clientEmail,
      clientPhone: values.clientPhone,
    }

    submit(eventData)
  }
  
  if (!propertyId || !properties?.data?.length) {
    return <div>Cargando propiedad...</div>
  }

  return (
    <>
      <h5 className="mb-4">Crear Orden de visita</h5>
      <div className="p-3">
        <Formik
          enableReinitialize
          initialValues={{
            eventType: 'visit order',
            title: '',
            startDate: new Date(),
            startTime: '09:00',
            endDate: new Date(),
            endTime: '09:00',
            description: 'Orden de visita',
            eventColor: 'fuchsia',
            customerId: null,
            propertyId: Number(propertyId) || null,
            propertyDirection: propertyData?.[0].address?.address || propertyData?.[0].address?.addressPublic || '',
            propertyPrice: propertyData?.[0].propertyPrice,
            propertyPriceCode: propertyData?.[0].currencyId,
            propertyCity: propertyData?.[0].address?.city?.name,
            propertyRegion:propertyData?.[0].address?.state?.name,
            clientName: '',
            clientRut: '',
            clientEmail: '',
            clientPhone: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            return handleSubmit(values, setSubmitting)
          }}
        >
          {({ values, touched, errors }) => (
            <Form>
              <FormContainer>
                <CustomerAutoFill customers={customers?.data || []} />

                <div className="grid xl:grid-cols-2 gap-4">
                  <div>
                    <FormItem label="Tipo de evento">
                      <Field name="eventType">
                        {({ field, form }: FieldProps) => (
                          <Select
                            field={field}
                            form={form}
                            options={eventTypes}
                            value={eventTypes.filter(
                              (type) => type.value === values.eventType
                            )}
                            onChange={(option) =>
                              form.setFieldValue(field.name, option?.value)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>
                    <FormItem label="Cliente">
                      <Field name="customerId">
                        {({ field, form }: FieldProps) => (
                          <Select
                            field={field}
                            form={form}
                            options={customerOptions}
                            value={customerOptions.filter(
                              (type) => type.value === values.customerId
                            )}
                            placeholder="Seleccionar..."
                            onChange={(option) =>
                              form.setFieldValue(field.name, option?.value)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>

                    <FormItem label="RUT del cliente">
                      <Field name="clientRut">
                        {({ field }: FieldProps) => (
                          <Input {...field} placeholder="RUT del cliente" />
                        )}
                      </Field>
                    </FormItem>

                    <div className="grid grid-cols-2 gap-4">
                      <FormItem label="Correo electrónico">
                        <Field name="clientEmail">
                          {({ field }: FieldProps) => (
                            <Input {...field} placeholder="cliente@email.com" type="email" />
                          )}
                        </Field>
                      </FormItem>

                      <FormItem label="Teléfono">
                        <Field name="clientPhone">
                          {({ field }: FieldProps) => (
                            <Input {...field} placeholder="+569..." type="tel" />
                          )}
                        </Field>
                      </FormItem>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormItem label="Fecha inicial">
                        <Field name="startDate">
                          {({ field, form }: FieldProps) => (
                            <DatePicker
                              value={field.value}
                              onChange={(date) =>
                                form.setFieldValue(field.name, date)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>
  
                      <FormItem label="Hora de inicio">
                        <Field name="startTime">
                          {({ field, form }: FieldProps) => (
                            <Input
                              type="time"
                              value={field.value}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>
                    </div>
                    
                  </div>

                  <div>
                    <FormItem
                      label="Título del evento"
                      invalid={errors.title && touched.title}
                      errorMessage={errors.title}
                    >
                      <Field
                        name="title"
                        placeholder="Ingresar título del evento"
                        component={Input}
                      />
                    </FormItem>

                    <FormItem label="Propiedad">
                      <Field name="propertyId">
                        {({ field, form }: FieldProps) => (
                          <Select
                            field={field}
                            form={form}
                            options={propertyOptions}
                            value={propertyOptions.filter(
                              (type) => type.value === values.propertyId
                            )}
                            placeholder="Seleccionar..."
                            onChange={(option) =>
                              form.setFieldValue(field.name, option?.value)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>

                    {/* Campos autocompletados */}
                    <FormItem label="Dirección de la propiedad">
                      <Field name="propertyDirection">
                        {({ field }: FieldProps) => (
                          <Input {...field} disabled placeholder="Dirección" />
                        )}
                      </Field>
                    </FormItem>

                    <div className="grid grid-cols-2 gap-4">
                      <FormItem label="Precio">
                        <Field name="propertyPrice">
                          {({ field }: FieldProps) => (
                            <Input {...field} disabled placeholder="Precio" />
                          )}
                        </Field>
                      </FormItem>

                      <FormItem label="Código moneda">
                        <Field name="propertyPriceCode">
                          {({ field }: FieldProps) => (
                            <Input {...field} disabled placeholder="CLP / UF" />
                          )}
                        </Field>
                      </FormItem>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormItem label="Fecha de término">
                        <Field name="endDate">
                          {({ field, form }: FieldProps) => (
                            <DatePicker
                              value={field.value}
                              onChange={(date) =>
                                form.setFieldValue(field.name, date)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>
  
                      <FormItem label="Hora de término">
                        <Field name="endTime">
                          {({ field, form }: FieldProps) => (
                            <Input
                              type="time"
                              value={field.value}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>
                    </div>
                  </div>
                </div>

                <FormItem className="text-right">
                  <Button variant="solid" type="submit">
                    Crear Visita
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default PdfForm
