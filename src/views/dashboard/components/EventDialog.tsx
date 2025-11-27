/* eslint-disable import/named */
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import hooks from '@/components/ui/hooks'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useDeleteEventMutation,
  useGetAllCustomersQuery,
  useGetAllPropertiesQuery,
} from '@/services/RtkQueryService'
import { injectReducer, useAppDispatch, useAppSelector } from '@/store'
import reducer from '@/views/my-calendar/store'
import { closeDialogSchedule } from '@/views/my-calendar/store/calendarSlice'
import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik } from 'formik'
import { HiCheck } from 'react-icons/hi'
import { components, ControlProps, OptionProps } from 'react-select'
import * as Yup from 'yup'

injectReducer('crmCalendar', reducer)

type FormModel = {
  title: string
  startDate: string | Date
  startTime: string
  endDate: string | Date
  endTime: string
  description: string
  eventColor: string
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
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
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

type ColorOption = {
  value: string
  label: string
  color: string
}

type EventDialogProps = {
  submit: (eventData: EventParam, type: string) => void
}

const { Control } = components

const { useUniqueId } = hooks

const colorOptions = [
  {
    value: 'red',
    label: 'red',
    color: 'bg-red-500',
  },
  //   {
  //     value: 'orange',
  //     label: 'orange',
  //     color: 'bg-orange-500',
  //   },
  //   {
  //     value: 'amber',
  //     label: 'amber',
  //     color: 'bg-amber-500',
  //   },
  //   {
  //     value: 'yellow',
  //     label: 'yellow',
  //     color: 'bg-yellow-500',
  //   },
  //   {
  //     value: 'lime',
  //     label: 'lime',
  //     color: 'bg-lime-500',
  //   },
  {
    value: 'green',
    label: 'green',
    color: 'bg-green-500',
  },
  //   {
  //     value: 'emerald',
  //     label: 'emerald',
  //     color: 'bg-emerald-500',
  //   },
  //   {
  //     value: 'teal',
  //     label: 'teal',
  //     color: 'bg-teal-500',
  //   },
  //   {
  //     value: 'cyan',
  //     label: 'cyan',
  //     color: 'bg-cyan-500',
  //   },
  //   {
  //     value: 'sky',
  //     label: 'sky',
  //     color: 'bg-lime-500',
  //   },
  //   {
  //     value: 'blue',
  //     label: 'blue',
  //     color: 'bg-blue-500',
  //   },
  //   {
  //     value: 'indigo',
  //     label: 'indigo',
  //     color: 'bg-indigo-500',
  //   },
  //   {
  //     value: 'purple',
  //     label: 'purple',
  //     color: 'bg-purple-500',
  //   },
  //   {
  //     value: 'fuchsia',
  //     label: 'fuchsia',
  //     color: 'bg-fuchsia-500',
  //   },
  //   {
  //     value: 'pink',
  //     label: 'pink',
  //     color: 'bg-pink-500',
  //   },
  //   {
  //     value: 'rose',
  //     label: 'rose',
  //     color: 'bg-rose-500',
  //   },
]

const eventTypes = [
  { value: 'event', label: 'Evento' },
  { value: 'visit order', label: 'Orden de Visita' },
]

const CustomSelectOption = ({
  innerProps,
  label,
  data,
  isSelected,
}: OptionProps<ColorOption>) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      {...innerProps}
    >
      <div className="flex items-center">
        <Badge className={data.color} />
        <span className="ml-2 rtl:mr-2 capitalize">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  )
}

const CustomControl = ({ children, ...props }: ControlProps<ColorOption>) => {
  const selected = props.getValue()[0]

  return (
    <Control className="capitalize" {...props}>
      {selected && <Badge className={`${selected.color} ltr:ml-4 rtl:mr-4`} />}
      {children}
    </Control>
  )
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Este campo es requerido'),
})

const EventDialog = ({ submit }: EventDialogProps) => {
  const dispatch = useAppDispatch()

  const [deleteEvent] = useDeleteEventMutation()

  const open = useAppSelector(
    (state) => state.crmCalendar?.data?.dialogOpenSchedule
  )
  const selected = useAppSelector((state) => state.crmCalendar?.data?.selected)
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
    properties?.data?.map((property) => ({
      value: Number(property.id),
      label: `#(${property.id})  ${property.propertyTitle}`,
    })) || []

  const customerOptions =
    customers?.data?.map((customer) => ({
      value: Number(customer.id),
      label: `${customer.name} ${customer.lastName} ${
        customer.alias && `(${customer.alias})`
      }`,
    })) || []

  const handleDialogClose = () => {
    dispatch(closeDialogSchedule())
  }

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
      id: selected.id || newId,
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
    }

    submit(eventData, selected?.type)
    dispatch(closeDialogSchedule())
  }
  const handleDelete = async () => {
    if (selected.id) {
      try {
        await deleteEvent(selected.id)
        dispatch(closeDialogSchedule())
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  return (
    <Dialog
      isOpen={open}
      onClose={handleDialogClose}
      onRequestClose={handleDialogClose}
    >
      <h5 className="mb-4">
        {selected?.type === 'NEW' ? 'Nuevo evento' : 'Actualizar evento'}
      </h5>
      <div className="max-h-96 overflow-y-auto p-3">
        <Formik
          enableReinitialize
          initialValues={{
            eventType: selected?.eventType || 'event',
            title: selected?.title || '',
            startDate: selected?.start
              ? dayjs(selected?.start).toDate()
              : new Date(),
            startTime: selected?.startTime || '09:00',
            endDate: selected?.end ? dayjs(selected?.end).toDate() : new Date(),
            endTime: selected?.endTime || '09:00',
            description: selected?.description || '',
            eventColor: selected?.color || colorOptions[0].value,
            customerId: Number(selected?.customerId) || null,
            propertyId: Number(selected?.propertyId) || null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) =>
            handleSubmit(values, setSubmitting)
          }
        >
          {({ values, touched, errors }) => {
            return (
              <Form>
                <FormContainer>
                  <FormItem
                    label="Tipo de evento"
                    invalid={(errors.eventType && touched.eventType) as boolean}
                    errorMessage={errors.eventType}
                  >
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

                  {values.eventType === 'visit order' && (
                    <div>
                      <FormItem
                        label="Cliente"
                        invalid={
                          (errors.customerId && touched.customerId) as boolean
                        }
                        errorMessage={errors.customerId}
                      >
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

                      <FormItem
                        label="Propiedad"
                        invalid={
                          (errors.propertyId && touched.propertyId) as boolean
                        }
                        errorMessage={errors.propertyId}
                      >
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
                    </div>
                  )}

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

                  <FormItem label="Descripción">
                    <Field
                      name="description"
                      placeholder="Ingresar detalles del evento u orden de visita"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem label="Color">
                    <Field name="eventColor">
                      {({ field, form }: FieldProps) => {
                        const selectedOption = colorOptions.find(
                          (option) => option.value === field.value
                        )

                        return (
                          <Select
                            components={{
                              Option: CustomSelectOption,
                              Control: CustomControl,
                            }}
                            placeholder="Seleccionar..."
                            menuPlacement="top"
                            options={colorOptions}
                            value={selectedOption}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem className="text-right">
                    {selected.type !== 'NEW' && (
                      <>
                        {/* <Button
                          variant="solid"
                          className="mr-2"
                          color="red-500"
                          onClick={handleDelete}
                        >
                          Eliminar
                        </Button> */}

                        <Button variant="solid" type="submit">
                          Actualizar
                        </Button>
                      </>
                    )}
                    {selected.type === 'NEW' && (
                      <Button variant="solid" type="submit">
                        Guardar
                      </Button>
                    )}
                  </FormItem>
                </FormContainer>
              </Form>
            )
          }}
        </Formik>
      </div>
    </Dialog>
  )
}

export default EventDialog
