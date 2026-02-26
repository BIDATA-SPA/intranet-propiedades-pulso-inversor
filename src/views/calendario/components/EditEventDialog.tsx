import {
  Button,
  FormContainer,
  FormItem,
  Notification,
  toast,
} from '@/components/ui'
import { usePatchEventMutation } from '@/services/RtkQueryService'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Dialog from '../../../components/ui/Dialog'
import CustomSelect from './CustomSelect'

import { format } from 'date-fns'
// import { es } from 'date-fns/locale';
// import {utcToZonedTime } from 'date-fns-tz';
// import { es } from 'date-fns/locale';

const validationSchema = Yup.object().shape({
  date: Yup.date().optional(),
  title: Yup.string().required('El título es requerido.'),
  description: Yup.string().required('La descripción es requerida.'),
  color: Yup.string().optional(),
})

const EditEventDialog = ({ openDialog, closeDialogs, eventData }) => {
  const [patchEvent, { isError, isSuccess }] = usePatchEventMutation()

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
        'bg-purple-200 text-purple-500 dark:bg-purple-500/20 dark:text-purple-100',
      label: 'Purpura',
      path: 'bg-purple-600',
    },
  ]

  const colorsOption = eventColors?.map((color) => ({
    value: color.value,
    label: color.label,
    path: color.path,
  }))

  const defaultValueColor = eventData && {
    value: eventData?.color,
    label: eventData?.color,
    path: eventData?.color,
  }

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
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values) => {
    try {
      const updatedEvent = { ...eventData, ...values }
      delete updatedEvent.createdByUserId
      delete updatedEvent.status
      delete updatedEvent.type
      await patchEvent(updatedEvent)

      closeDialogs()
      openNotification(
        'success',
        'Evento Editado',
        'Evento editado correctamente',
        4
      )
      setIsLoading(false)
      setTimeout(() => {
        navigate('/mi-calendario')
      }, 1 * 3000)
    } catch (error) {
      if (error) {
        setIsLoading(true)
        openNotification(
          'danger',
          `Error al Editar`,
          'El Evento No ha sido Editado',
          4
        )
        setIsLoading(false)
        setTimeout(() => {
          navigate('/mi-calendario')
        }, 1 * 3000)
        throw new Error(error.message)
      }
    }
  }

  const formatDateDisplay = (dateString) => {
    const newdate = new Date(dateString)
    return newdate.toLocaleDateString('es-ES', {
      timeZone: 'UTC',
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog
      isOpen={openDialog}
      width={600}
      className="md:h-[80vh] 2xl:h-auto"
      onClose={closeDialogs}
    >
      <h2 className="text-2xl mb-1">Editar Evento</h2>
      <p className="text-md font-semibold mb-3">
        Fecha de evento: {formatDateDisplay(eventData.date)} hrs
      </p>
      <Formik
        enableReinitialize
        initialValues={eventData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <FormContainer className="overflow-y-scroll 2xl:overflow-y-auto h-full md:h-[53vh] 2xl:h-[52vh] mb-6 px-2">
              <FormItem asterisk label="Fecha">
                <Field
                  type="datetime-local"
                  name="date"
                  defaultValue={format(
                    new Date(eventData.date),
                    'yyyy-MM-dd HH:mm a'
                  )}
                  className="border p-2 px-3 w-full rounded-md"
                />
                {errors.date && touched.date && <div>{eventData.date}</div>}
              </FormItem>
              <FormItem asterisk label="Titulo">
                <Field
                  type="text"
                  name="title"
                  className="border p-2 px-3 w-full rounded-md"
                >
                  {errors.title && touched.title && (
                    <div>{eventData.title}</div>
                  )}
                </Field>
              </FormItem>
              <FormItem asterisk label="Descripción">
                <Field
                  type="text"
                  name="description"
                  className="border p-2 px-3 w-full rounded-md"
                />
                {errors.description && touched.description && (
                  <div>{eventData.description}</div>
                )}
              </FormItem>
              <FormItem asterisk label="Color">
                <CustomSelect
                  options={colorsOption}
                  defaultValue={defaultValueColor}
                  onChange={(selectedOption) =>
                    setFieldValue('color', selectedOption.value)
                  }
                ></CustomSelect>
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
                className="button bg-lime-500 hover:bg-sky-400 active:bg-sky-600 text-white radius-round h-9 px-4 py-2 text-sm w-96 md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
              >
                Guardar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default EditEventDialog
