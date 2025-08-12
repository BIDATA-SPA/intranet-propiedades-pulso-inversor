import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Select,
  toast,
} from '@/components/ui'
import { useCreateEventCalendarMutation } from '@/services/RtkQueryService'
import {
  CalendarFormModel,
  CreateEventCalendar,
} from '@/services/calendar/types/calendar.type'
import { Field, FieldProps, Form, Formik } from 'formik'
import { OptionProps, SingleValueProps, components } from 'react-select'
import Dialog from '../../../components/ui/Dialog'

import { useEffect } from 'react'

type FormModel = CalendarFormModel

type ColorOption = {
  value: string
  label: string
}

const { SingleValue } = components

const ColorSelectOption = ({
  innerProps,
  data,
  isSelected,
}: OptionProps<ColorOption>) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-between p-2 ${
        isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <span>{data.label}</span>
      </div>
    </div>
  )
}

const ColorControl = (props: SingleValueProps<ColorOption>) => {
  const selected = props.getValue()[0]
  return (
    <SingleValue {...props}>
      {selected && <span>{selected.label}</span>}
    </SingleValue>
  )
}

const MainContentEvent = ({
  closeDialogs,
  validateForm,
  selectedEvent,
  setSelectedEvent,
}) => {
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

  const [
    createEventCalendar,
    { isError, isLoading, isSuccess, isUninitialized },
  ] = useCreateEventCalendarMutation()

  // const [eventsData, setEventsData] = useState([])

  const eventColors = [
    { value: 'orange', label: 'Naranja' },
    // { value: 'red', label: 'Rojo' },
    { value: 'blue', label: 'Azul' },
    { value: 'green', label: 'Verde' },
    { value: 'yellow', label: 'Amarillo' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'purple', label: 'Purpura' },
  ]

  const onSubmit = (values: FormModel) => {
    const { title, description, color, date } = values

    const body: CreateEventCalendar = {
      title,
      description,
      color,
      date,
    }

    createEventCalendar(body)
    closeDialogs()
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Evento Creado',
        'Evento Creado correctamente',
        4
      )
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error al Crear',
        'Error al Crear Evento, intente más tarde ',
        4
      )
    }
  }, [isError, isSuccess])

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: '',
        description: '',
        color: '',
        date: selectedEvent,
      }}
      validateForm={validateForm}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        return (
          <>
            <h2 className="text-2xl mb-1">Agregar Eventos</h2>
            {setSelectedEvent && (
              <p className="text-md font-semibold mb-3">
                Fecha seleccionada: {selectedEvent.toLocaleDateString()}
              </p>
            )}
            <Form>
              <FormContainer>
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
                  asterisk
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
                        value={eventColors.filter(
                          (evColor) => evColor.value === values.color
                        )}
                        onChange={(color) =>
                          form.setFieldValue(field.name, color?.label)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
              </FormContainer>
              <div className="flex justify-between">
                <button
                  className="button bg-red-700 hover:bg-red-500 active:bg-red-600 text-white radius-round h-9 px-3 py-2 text-sm w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
                  type="button"
                  onClick={closeDialogs}
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  variant="solid"
                  loading={isLoading}
                  className="button bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white radius-round h-9 px-3 py-2 text-sm w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
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

const CreateEventDialog = ({
  openDialog,
  closeDialogs,
  validateForm,
  selectedEvent,
  setSelectedEvent,
}) => {
  return (
    <Dialog isOpen={openDialog} height={500} onClose={closeDialogs}>
      <MainContentEvent
        closeDialogs={closeDialogs}
        validateForm={validateForm}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </Dialog>
  )
}

export default CreateEventDialog
