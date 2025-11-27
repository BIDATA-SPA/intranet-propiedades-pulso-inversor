import {
  Badge,
  Button,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Select,
  toast,
} from '@/components/ui'
import {
  CalendarFormModel,
  CreateEventCalendar,
} from '@/services/calendar/types/calendar.type'
import { useCreateEventCalendarMutation } from '@/services/RtkQueryService'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OptionProps, SingleValueProps, components } from 'react-select'
import * as Yup from 'yup'
import Dialog from '../../../components/ui/Dialog'

const validateForm = Yup.object().shape({
  date: Yup.string().required('Debe agregar/seleccionar una fecha'),
  time: Yup.string().required('Debe agregar/seleccionar una hora'),
  title: Yup.string().required('El titulo es requerido.'),
  description: Yup.string().optional(),
  color: Yup.string().optional(),
})

type FormModel = CalendarFormModel

type ColorOption = {
  value: string
  label: string
  path: string
}

const { SingleValue } = components

const eventColors = [
  {
    value:
      'bg-orange-200 text-orange-500 dark:bg-orange-500/20 dark:text-orange-100',
    label: 'Naranja',
    path: 'bg-orange-500',
  },
  // { value: 'red', label: 'Rojo' },
  {
    value: 'bg-blue-200 text-blue-500 dark:bg-blue-500/20 dark:text-blue-100',
    label: 'Azul',
    path: 'bg-blue-600',
  },
  {
    value:
      'bg-green-200 text-green-500 dark:bg-green-500/20 dark:text-green-100',
    label: 'Verde',
    path: 'bg-green-600',
  },
  {
    value:
      'bg-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-100',
    label: 'Amarillo',
    path: 'bg-yellow-600',
  },
  {
    value: 'bg-cyan-200 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-100',
    label: 'Cyan',
    path: 'bg-cyan-600',
  },
  {
    value:
      'bg-purple-200 text-pruple-500 dark:bg-pruple-500/20 dark:text-pruple-100',
    label: 'Purpura',
    path: 'bg-purple-600',
  },
]

const ColorSelectOption = ({
  innerProps,
  data,
  isSelected,
}: OptionProps<ColorOption>) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-between p-2 ${
        isSelected
          ? `hover:bg-gray-200 dark:bg-gray-500`
          : `hover:bg-gray-200  dark:hover:bg-gray-600`
      }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <Badge className={`ltr:ml-2 rtl:mr-2 rounded-full ${data.path}`} />
        <span>{data.label}</span>
      </div>
    </div>
  )
}

const ColorControl = (props: SingleValueProps<ColorOption>) => {
  const selected = props.getValue()[0]
  return (
    <SingleValue {...props}>
      {selected && (
        <div className="relative">
          <Badge
            className={`absolute z-50 left-0 top-1.5 rounded-full ${selected.path}`}
          />
          <span className="ml-4">{selected.label}</span>
        </div>
      )}
    </SingleValue>
  )
}

const MainContentEvent = ({ closeDialogs, selectedDate }) => {
  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const [createEventCalendar, { isError, isSuccess, isUninitialized }] =
    useCreateEventCalendarMutation()

  // const [eventsData, setEventsData] = useState([])
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = (values: FormModel) => {
    const { title, description, color, date, time } = values

    const body: CreateEventCalendar = {
      title,
      description,
      color,
      date: `${date}T${time}`,
    }
    createEventCalendar(body)
    closeDialogs()
    try {
      if (isUninitialized) {
        setIsLoading(true)
        if (body) {
          openNotification(
            'success',
            `Evento Creado ${body.title}`,
            'Evento Creado correctamente',
            4
          )
          setIsLoading(false)
          setTimeout(() => {
            navigate('/mi-calendario')
          }, 1 * 3000)
        }
      }
    } catch (error) {
      if (error) {
        setIsLoading(true)
        openNotification(
          'danger',
          `Error al Crear ${error.message}`,
          'Evento No ha sido Creado',
          4
        )
        setIsLoading(false)
        setTimeout(() => {
          navigate('/mi-calendario')
        }, 1 * 3000)
        throw new Error(error.message)
      }
    }

    if (isSuccess) {
      openNotification(
        'success',
        'Evento Creado',
        'Evento Creado correctamente',
        4
      )
    }

    if (isUninitialized && isError) {
      openNotification(
        'warning',
        'Error al Crear',
        'Error al Crear Evento, intente más tarde ',
        4
      )
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: '',
        description: '',
        color: '',
        date: selectedDate.toISOString().split('T')[0],
      }}
      validateForm={validateForm}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        return (
          <>
            <h2 className="text-2xl mb-1">Agregar Eventos</h2>
            {selectedDate && (
              <p className="text-md font-semibold mb-3">
                Fecha seleccionada:{selectedDate.toLocaleDateString()}
              </p>
            )}
            <Form>
              <FormContainer className="overflow-y-scroll 2xl:overflow-y-auto md:h-[53vh] 2xl:h-[52vh] max-h-[90vh] mb-6 px-2">
                <div className="flex flex-col md:flex-row gap-3">
                  <FormItem asterisk label="Fecha" className="w-full ">
                    <Field name="date">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            required={true}
                            field={field}
                            size="md"
                            className="w-full"
                            value={values.date}
                            type="date"
                            onChange={(e) => {
                              form.setFieldValue(e.target.name, e.target.value)
                            }}
                          ></Input>
                        )
                      }}
                    </Field>
                  </FormItem>
                  <FormItem asterisk label="Hora" className="w-full md:w-1/2">
                    <Field name="time">
                      {({ field, form }: FieldProps<FormModel>) => (
                        <Input
                          required={true}
                          field={field}
                          size="md"
                          value={values.time}
                          type="time"
                          step={900}
                          onChange={(e) => {
                            form.setFieldValue(e.target.name, e.target.value)
                          }}
                        ></Input>
                      )}
                    </Field>
                  </FormItem>
                </div>
                <FormItem
                  asterisk
                  label="Titulo"
                  invalid={errors.title && touched.title}
                  errorMessage={errors.title}
                >
                  <Field name="title">
                    {({ field, form }: FieldProps<FormModel>) => {
                      return (
                        <Input
                          required={true}
                          field={field}
                          size="md"
                          placeholder="Agregar titulo"
                          value={values.title}
                          type="text"
                          onChange={(e) => {
                            form.setFieldValue(e.target.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem>
                <FormItem
                  label="Descripción"
                  invalid={errors.description && touched.description}
                  errorMessage={errors.description}
                >
                  <Field name="description">
                    {({ field, form }: FieldProps<FormModel>) => {
                      return (
                        <Input
                          field={field}
                          size="md"
                          placeholder="Agregar Descripción"
                          value={values.description}
                          textArea={true}
                          // type="text"
                          onChange={(e) => {
                            form.setFieldValue(e.target.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem>
                <FormItem
                  label="Color"
                  invalid={errors.color && touched.color}
                  errorMessage={errors.color}
                >
                  <Field name="color">
                    {({ field, form }: FieldProps) => (
                      <Select<ColorOption>
                        className="min-w-[130px]"
                        placeholder="Color del evento"
                        components={{
                          Option: ColorSelectOption,
                          SingleValue: ColorControl,
                        }}
                        field={field}
                        form={form}
                        options={eventColors}
                        value={
                          eventColors.find(
                            (evColor) => evColor.value === values.color
                          ) || null
                        }
                        menuPlacement="top"
                        onChange={(color) =>
                          form.setFieldValue(field.name, color?.value || '')
                        }
                      />
                    )}
                  </Field>
                </FormItem>
              </FormContainer>
              <div className="flex justify-between gap-3">
                <button
                  className="button bg-red-700 hover:bg-red-500 active:bg-red-600 text-white radius-round h-9 px-3 py-2 text-sm w-96 md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
                  type="button"
                  onClick={closeDialogs}
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  variant="solid"
                  loading={isLoading}
                  className="button bg-lime-500 hover:bg-sky-400 active:bg-sky-600 text-white radius-round h-9 px-3 py-2 text-sm w-96 md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
                >
                  Agregar
                </Button>
              </div>
            </Form>
          </>
        )
      }}
    </Formik>
  )
}

const CreateEventDialog = ({ openDialog, closeDialogs, selectedDate }) => {
  return (
    <Dialog
      isOpen={openDialog}
      width={600}
      className="xl:h-[80vh]  2xl:max-h-[75vh]"
      onClose={closeDialogs}
    >
      <MainContentEvent
        closeDialogs={closeDialogs}
        selectedDate={selectedDate}
      />
    </Dialog>
  )
}

export default CreateEventDialog
