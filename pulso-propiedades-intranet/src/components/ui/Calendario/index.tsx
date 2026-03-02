import CalendarView from '@/components/shared/CalendarView'
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Select,
  toast,
} from '@/components/ui'
import {
  useCreateEventMutation,
  useGetEventsQuery,
} from '@/services/RtkQueryService'
import {
  CalendarFormModel,
  CreateEventCalendar,
} from '@/services/calendar/types/calendar.type'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import Dialog from '../Dialog'

import { OptionProps, SingleValueProps, components } from 'react-select'
import * as Yup from 'yup'
import EditFormModal from './editForm/EditFormModal'

const validateForm = Yup.object().shape({
  title: Yup.string().required('El titulo es requerido.'),
  description: Yup.string().required('La descripción es requerida'),
  color: Yup.string().optional(),
})

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

const CalendarPro = () => {
  // funcion para obtener el dia en calendario
  function getDate(dayString: string) {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString()

    if (month.length === 1) {
      month = '0' + month
    }

    return dayString.replace('YEAR', year).replace('MONTH', month)
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
  const { data, isFetching, error, refetch } = useGetEventsQuery()
  // post
  const [createEvent, { isError, isLoading, isSuccess, isUninitialized }] =
    useCreateEventMutation()
  // editar
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editInitValues, setEditInitValues] = useState({
    title: '',
    description: '',
    color: '',
    date: null,
  })

  // useEffect(() => {
  //   if(data && !isFetching){
  //     setEditInitValues({
  //       title:data?.title,
  //       description: data?.description,
  //       color:data?.color,
  //       date: data?.date,
  //     })
  //   }else {
  //     setEditInitValues({
  //       title:'',
  //       description: '',
  //       color:'',
  //       date: null,
  //     })
  //   }
  // },[data,isFetching]);

  // const [eventsData, setEventsData] = useState([ //llenaré de data al clickear en las casillas del calendario
  //   {
  //     id: '0',
  //     title: 'Visita de casa',
  //     descript:'',
  //     start: getDate('YEAR-MONTH-01'),
  //     eventColor: 'orange',
  //   },
  // ])

  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    if (data) {
      setEventsData(data)
    }
  }, [data])

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const onSubmit = (values: FormModel) => {
    const { title, description, color, date } = values

    const body: CreateEventCalendar = {
      title,
      description,
      color,
      date,
    }
    createEvent(body)
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

  // const [formEditData, setFormEditData] = useState({
  //   id:'',
  //   title: '',
  //   descript:'',
  //   start: null,
  //   evenColor: '',
  // })

  //Aqui muestra mi formulario,  con la fecha de la casilla que seleccioné.
  const handleShowForm = (selectedDate: Date) => {
    setShowForm(true)
    setSelectedEvent(selectedDate)
  }
  // Aquí abrire el Dialog para editar mi formulario.
  // const handleShowEditForm = (event: any) => {
  //   setFormData({
  //     title: event.title,
  //     descript:formData.descript,
  //     start: formData.start,
  //     evenColor: formData.evenColor,
  //   });
  //   setShowForm(true)
  //   setSelectedEvent(event)
  // }

  //Aqui mi función submit del form ¿Qué más puedo agregar?
  // const handleOnSubmitForm = () => {
  //   if (formData.title && formData.descript && formData.start && formData.evenColor) {
  //     const updateEvent = [...eventsData];
  //     openNotification(
  //       'success',
  //       'Evento Creado',
  //       'Evento Creado correctamente',
  //       4
  //     )

  //     if(selectedEvent){
  //       const index = updateEvent.findIndex((event) => event.id === selectedEvent.id);
  //       if(index !== -1){
  //         updateEvent[index] = {
  //           ...selectedEvent,
  //           title:formData.title,
  //           descript: formData.descript,
  //           start: formData.start,
  //           eventColor: formData.evenColor,
  //         };
  //         setSelectedEvent(null);
  //         setEventsData(updateEvent);
  //         setSelectedEvent(updateEvent[index]);
  //         setShowForm(false);
  //       }
  //     }else {
  //       const newEvent = {
  //         id: eventsData.length.toString(),
  //         title: formData.title,
  //         descript:formData.descript,
  //         start: formData.start,
  //         eventColor: formData.evenColor,
  //       };
  //       updateEvent.push(newEvent);
  //       setEventsData(updateEvent);
  //       setSelectedEvent(newEvent);
  //       setShowForm(false);
  //     };

  //   }
  // };

  const handleCancelForm = () => {
    setShowForm(false)
  }

  // const handleEditShowForm = (selectedDate:Date) =>{
  //   setShowEditForm(true)
  //   setSelectedEvent(selectedDate);
  // }

  const handleCancelEditForm = () => {
    setShowEditForm(false)
    setSelectedEvent(null)
  }

  const eventColors = [
    { value: 'orange', label: 'Naranja' },
    // { value: 'red', label: 'Rojo' },
    { value: 'blue', label: 'Azul' },
    { value: 'green', label: 'Verde' },
    { value: 'yellow', label: 'Amarillo' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'purple', label: 'Purpura' },
  ]

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
            {/*
                    <form>
                      <div className='relative mb-3'>
                        <label htmlFor='evenColor'>Color de etiqueta</label>
                        <select  
                        id='evenColor' 
                        className='input input-md h-11 focus:ring-sky-400 focus-within:ring-sky-400 focus-within:border-sky-400 focus:border-sky-400' 
                        value={formData.evenColor} 
                        onChange={(e) => setFormData({ ...formData, evenColor: e.target.value })} 
                        >
                            {eventColors.map((color) => (
                                <option key={color.value} value={color.value}>
                                   {color.label}
                                 </option>
                            ))}
                        </select>
                      </div>
              )} */}

            {showForm && (
              <Dialog isOpen closable height={500} onClose={handleCancelForm}>
                <h2 className="text-2xl mb-1">
                  {handleShowForm ? 'Agregar Eventos' : 'Editar Evento'}
                </h2>
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
                                form.setFieldValue(
                                  e.target.name,
                                  e.target.value
                                )
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
                                form.setFieldValue(
                                  e.target.name,
                                  e.target.value
                                )
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
                      onClick={handleCancelForm}
                    >
                      Cancelar
                    </button>
                    <Button
                      type="submit"
                      variant="solid"
                      loading={isLoading}
                      className="button bg-lime-500 hover:bg-sky-400 active:bg-sky-600 text-white radius-round h-9 px-3 py-2 text-sm w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
                    >
                      Agregar
                    </Button>
                  </div>
                </Form>
              </Dialog>
            )}

            <EditFormModal
              isEditingFields={isEditingFields}
              setIsEditFields={setIsEditingFields}
              initValues={editInitValues}
              // selectedEvent = {selectedEvent}
              showEditForm={showEditForm}
            />

            <CalendarView
              editable
              selectable
              events={eventsData}
              eventClick={(arg) => {
                setSelectedEvent(arg.event)
                setShowEditForm(true)
                setEditInitValues({
                  title: arg.event._def.title,
                  description: arg.event._def.extendedProps.description,
                  color: arg.event._def.extendedProps.color,
                  date: arg.event._def.extendedProps.date,
                })
                // handleShowEditForm(arg.event)
              }}
              select={(event) => {
                handleShowForm(event.start)
              }}
              eventDrop={(arg) => {
                alert('')
              }}
            />
          </>
        )
      }}
    </Formik>
  )
}

export default CalendarPro
