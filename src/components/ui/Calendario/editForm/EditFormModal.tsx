import { Button, Notification, toast } from '@/components/ui'
import { usePatchEventMutation } from '@/services/RtkQueryService'
import { CreateEventCalendar } from '@/services/calendar/types/calendar.type'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import Dialog from '../../Dialog'

const validationEditSchema = Yup.object().shape({
  title: Yup.string().required('Titulo requerido'),
  description: Yup.string().required('Descripción requerida'),
  color: Yup.string().optional(),
})

type FormModel = Partial<CreateEventCalendar>

const EditFormModal = ({
  isEditingFields,
  setIsEditFields,
  initValues,
  // selectedEvent,
  showEditForm,
}: {
  isEditingFields: boolean
  setIsEditFields: any
  initValues: FormModel
  // selectedEvent: any,
  showEditForm: boolean
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showForm, setShowEditForm] = useState(false)

  const { eventId } = useParams()

  const handleCancelEditForm = () => {
    setShowEditForm(false)
    setSelectedEvent(null)
  }
  const [patchEvent, { isLoading, isSuccess, isError, isUninitialized }] =
    usePatchEventMutation()

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
  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Evento Actualizado',
        'Evento actualizado correctamente',
        3
      )

      setIsEditFields(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Error al actualizar el Evento, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  const onSubmit = (values: FormModel) => {
    const { title, description, color, ...eventData } = values

    const body: Partial<CreateEventCalendar> = {
      ...eventData,
    }

    patchEvent({ id: eventId, ...body })
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initValues}
      validationSchema={validationEditSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, isSubmitting }) => {
        return (
          <>
            {showEditForm && selectedEvent && (
              <Dialog
                isOpen
                closable
                height={500}
                onClose={handleCancelEditForm}
              >
                <h2 className="text-2xl mb-1">Editar Evento</h2>
                {setSelectedEvent && (
                  <p className="text-md font-semibold mb-3">
                    Fecha seleccionada: {selectedEvent.toLocaleDateString()}
                  </p>
                )}
                <Form>
                  <div className="flex justify-between">
                    <button
                      className="button bg-red-700 hover:bg-red-500 active:bg-red-600 text-white radius-round h-9 px-3 py-2 text-sm w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
                      type="button"
                      onClick={handleCancelEditForm}
                    >
                      Cancelar
                    </button>
                    <Button
                      type="submit"
                      variant="solid"
                      loading={isLoading}
                      className="button bg-lime-500 hover:bg-sky-400 active:bg-sky-600 text-white radius-round h-9 px-3 py-2 text-sm w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
                    >
                      Editar
                    </Button>
                  </div>
                </Form>
              </Dialog>
            )}
          </>
        )
      }}
    </Formik>
  )
}

export default EditFormModal
