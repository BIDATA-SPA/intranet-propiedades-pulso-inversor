import Badge from '@/components/ui/Badge'
import Calendar from '@/components/ui/Calendar'
// import CalendarBase from '@/components/ui/DatePicker/CalendarBase'
import Card from '@/components/ui/Card'
import useThemeClass from '@/utils/hooks/useThemeClass'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FaFileSignature, FaPlus } from 'react-icons/fa'
import { HiDocumentText } from 'react-icons/hi'

import {
  useGetEventsQuery,
  // useGetEventCalendarQuery,
  useGetVisitOrderQuery,
} from '@/services/RtkQueryService'

import { Dropdown } from '@/components/ui'
import UseDialog from '../hooks/useDialogs'
import CreateEventDialog from './CreateEventDialog'
import EditEventDialog from './EditEventDialog'

import UseDialogVisitOrd from '../hooks/useDialogVisitOr'

import { injectReducer } from '@/store'
import reducer from '@/views/my-calendar/store'
import CreateVisitOrderDialog from '../visitOrder/components/CreateVisitOrder'
import EditVisitOrderDialog from '../visitOrder/components/EditVisitOrder'

injectReducer('crmCalendar', reducer)

type CombinedDataType = {
  id: string
  date: string
  title: string
  description: string
  type: string
  // locale: string;
  status: []
  color: string
  customerId?: string
  propertyId?: string
  customerName: string
  alias?: string
  propertyName: string
}

const isToday = (someDate: Date) => {
  const today = new Date()
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  )
}

const EventIcon = ({ type, color }: { type: string; color: string }) => {
  const baseClass =
    'rounded-lg h-14 w-14 md:h-10 md:w-10 text-2xl md:text-lg flex items-center justify-center'
  switch (type) {
    case 'ov':
      return (
        <div
          className={classNames(
            baseClass,
            'bg-fuchsia-200 text-fuchsia-500 dark:bg-orange-500/20 dark:text-orange-100'
            // color
          )}
        >
          <FaFileSignature />
        </div>
      )
    case 'task':
      return (
        <div className={classNames(baseClass, color)}>
          <HiDocumentText />
        </div>
      )
    default:
      return (
        <div className={classNames(baseClass, color)}>
          <HiDocumentText />
        </div>
      )
  }
}

// const Schedule = ( { isData = [] }: ScheduleProps) => {
const ScheduleCalendar = () => {
  const [combinedData, setCombined] = useState<CombinedDataType[]>([])
  const [value, setValue] = useState<Date | null>()
  const [filteredEvents, setFilteredEvents] = useState<CombinedDataType[]>([])
  const { textTheme } = useThemeClass()
  const [filterTask, setFilterTask] = useState('diaria')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CombinedDataType | null>(
    null
  )

  const { openDialog, openCreateDialog, openUpdateDialog, closeDialogs } =
    UseDialog()

  const {
    openDialogVisOrd,
    openCreateDialogVisOrd,
    openUpdateDialogVisOrd,
    closeDialogsVisOrd,
  } = UseDialogVisitOrd()

  //Events or tasks
  const handleShowCreate = (date: Date) => {
    const currentTime = new Date()
    const selectedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds()
    )
    setSelectedDate(selectedDateTime)
    openCreateDialog()
  }

  const handleEditEvent = (event: CombinedDataType) => {
    setSelectedEvent(event)
    if (event.type === 'ov') {
      openUpdateDialogVisOrd()
    } else {
      openUpdateDialog()
    }
  }

  const handleClickFilter = (filteredSelect: string) => {
    setFilterTask(filteredSelect)
  }

  // const today = new Date();
  const today = selectedDate

  const getStartEndOfWeek = () => {
    const startWeek = new Date(today) //inicia un domingo;
    startWeek.setDate(today.getDate() - today.getDay()) //inicia un domingo;

    const endWeek = new Date(today) //termina un sábado;
    endWeek.setDate(today.getDate() - today.getDay() + 6) //termina un sábado;

    return { startWeek, endWeek }
  }

  const getStartEndOfMonth = () => {
    // Eventos del mismo mes
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return { startMonth, endMonth }
  }

  const filterEvents = (events: CombinedDataType[], filtro: string) => {
    const { startWeek, endWeek } = getStartEndOfWeek()
    const { startMonth, endMonth } = getStartEndOfMonth()

    // if(!data) return 0
    switch (filtro) {
      case 'diaria':
        return events.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate.toDateString() === today.toDateString()
        })
      case 'semanal':
        return events.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= startWeek && eventDate <= endWeek
        })
      case 'mensual':
        return events.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= startMonth && eventDate <= endMonth
        })
      default:
        return events
    }
  }

  const { data: eventData } = useGetEventsQuery()
  const { data: orderData } = useGetVisitOrderQuery()

  // Visits Orders
  const handleShowOrderVisit = (date: Date) => {
    const currentTime = new Date()
    const selectedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds()
    )
    setSelectedDate(selectedDateTime)
    openCreateDialogVisOrd()
  }

  // const handleDateSelectViOr = (selectedDate) => {
  //     handleShowOrderVisit(selectedDate)
  // }

  // const handleEditOv = (event: CombinedDataType) =>{
  //     setSelectedEvent(event);
  //     openUpdateDialogVisOrd();
  // };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  useEffect(() => {
    if (eventData && orderData) {
      const combined = [
        ...eventData.map((event) => ({ ...event, type: 'task' })),
        ...orderData.map((order) => ({
          ...order,
          type: 'ov',
          cutomerName:
            order?.customer &&
            `${order?.customer?.name} ${order?.customer?.lastName}`,
          customerAlias: order?.alias ?? '',
          propertyName: order?.property?.propertyTitle,
          alias: order?.alias ?? '',
        })),
      ]

      setCombined(combined)
    }
  }, [eventData, orderData])

  useEffect(() => {
    if (value) {
      const filtered = combinedData.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === value.getDate() &&
          eventDate.getMonth() === value.getMonth() &&
          eventDate.getFullYear() === value.getFullYear()
        )
      })
      setFilteredEvents(filtered)
    }
  }, [value, combinedData])

  useEffect(() => {
    setFilteredEvents(filterEvents(combinedData, filterTask))
  }, [combinedData, filterTask, selectedDate])

  // useEffect(() => {
  //     if(data){
  //         setEvents(data);
  //     }
  // },[data])

  // useEffect(() => {
  //     if (Array.isArray(data)) {
  //         setTotalEvents(data.length);
  //     }
  // }, [data])

  // useEffect(() => {
  //     if(value) {
  //         const filteredOv = orderVisit.filter(order => {
  //             const orderVisitDate = new Date(order.date);
  //             return orderVisitDate.getDate() === value.getDate() && orderVisitDate.getMonth() === value.getMonth() && orderVisitDate.getFullYear() === value.getFullYear();
  //         });
  //         setFilteredOv(filteredOv)
  //     }
  // }, [value, orderVisit]);

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-2 h-full 2xl:h-[75vh] md:max-h-full 2xl:max-h-[98vh] md:overflow-hidden 2xl:mt-4 sm:mt-0 border border-1 rounded-md shadow-md xl:px-2">
        <Card className="flex flex-col border-none md:col-span-1 mb-2 pb-2 mt-12 ">
          <div className="md:mx-auto">
            <Calendar
              locale="esLocale"
              value={selectedDate}
              dayClassName={(date, { selected }) => {
                const defaultClass =
                  'text-base border rounded-none py-10 xl:py-8 group '

                if (isToday(date) && !selected) {
                  return classNames(defaultClass, textTheme)
                }

                if (selected) {
                  return classNames(defaultClass, 'text-white')
                }

                return defaultClass
              }}
              dayStyle={() => {
                return { height: 48 }
              }}
              renderDay={(date) => {
                const day = date.getDate()
                // revisa si hay más eventos
                const hasEvents = combinedData.some((eventDay) => {
                  const eventDate = new Date(eventDay.date)
                  return (
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                  )
                })

                // if (!isToday(date)) {
                //     return <span className="relative flex justify-center items-center w-full h-full">
                //         {day}
                //         {hasEvents && (
                //                 <>
                //                     <Badge
                //                         className="absolute bottom-1 bg-yellow-600"
                //                         innerClass="h-1 w-2"
                //                     />
                //                 </>
                //             )}
                //         </span>
                // }
                return (
                  <div className="relative flex flex-col items-center w-full h-full">
                    <span className="">{day}</span>
                    {hasEvents && (
                      <>
                        <Badge
                          className="absolute top-6 bg-yellow-600"
                          innerClass="h-1 w-2"
                        />
                      </>
                    )}
                    <div className="absolute bottom-2 left-0 sm:left-1 flex opacity-0 group-hover:opacity-100 sm:gap-2">
                      <small
                        className="p-1 bg-blue-200 text-blue-500 opacity-70 rounded-md hover:opacity-100 hover:scale-110 duration-150"
                        onClick={() => handleShowCreate(date)}
                      >
                        <FaPlus size={10} />
                      </small>
                      <small
                        className="p-1 bg-fuchsia-200 text-fuchsia-500 opacity-70 rounded-md hover:opacity-100 hover:scale-110 duration-150"
                        onClick={() => handleShowOrderVisit(date)}
                      >
                        <FaFileSignature size={10} />
                      </small>
                    </div>
                  </div>
                )

                // return (
                //     <span className="relative flex justify-center items-center w-full h-full">
                //         {day}
                //         <Badge
                //             className="absolute bottom-1 bg-blue-950"
                //             innerClass="h-1 w-2"
                //         />
                //     </span>
                // )
              }}
              onChange={(val) => {
                setValue(val)
                setSelectedDate(val)
                // handleShowCreate(val)
                // handleDateSelection(val)
                // handleShowOrderVisit(val)
              }}
            />
          </div>
        </Card>
        <div className="md:col-span-1 px-2 mt-6 pb-1">
          <div className="flex flex-col xl:flex-row justify-start md:justify-between mb-3 items-center">
            <div className="flex mb-2">
              <p className="font-medium">
                Ordernar por
                <Dropdown title={filterTask} trigger="hover" className="">
                  <Dropdown.Item
                    eventKey="diaria"
                    onSelect={() => handleClickFilter('diaria')}
                  >
                    diarias
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="semanal"
                    onSelect={() => handleClickFilter('semanal')}
                  >
                    semanales
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="mensual"
                    onSelect={() => handleClickFilter('mensual')}
                  >
                    mensuales
                  </Dropdown.Item>
                </Dropdown>
              </p>
            </div>
            <div className="flex mb-2 gap-4">
              <button
                className="flex gap-2 p-2 px-2 items-center bg-lime-500 hover:scale-105 duration-200 text-gray-50 rounded-md mx-auto"
                onClick={() => handleShowCreate(selectedDate)}
              >
                <FaPlus />
                Evento / Tarea
              </button>
              <button
                className="flex gap-2 p-2 px-2 items-center bg-emerald-500 text-gray-50  hover:scale-105 duration-200 rounded-md mx-auto"
                onClick={() => handleShowOrderVisit(selectedDate)}
              >
                <FaPlus />
                Orden de visita
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl">Mi agenda</h3>
            <p>{filteredEvents?.length || '0'} Eventos</p>
          </div>
          <div className="h-[100%] md:h-[400px] xl:h-[80%] xl:max-h-[90vh] w-full md:w-full md:pr-2 overflow-y-auto">
            {filteredEvents.length !== 0
              ? filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col md:flex-row items-center justify-between mb-2 md:p-2 hover:bg-gray-50 hover:scale-95 duration-300 dark:hover:bg-gray-600/40 cursor-pointer user-select border-b-2 "
                    onClick={() => handleEditEvent(event)}
                  >
                    <div className="flex flex-col md:flex-row items-center md:gap-3 w-full md:w-86 ">
                      <EventIcon type={event.type} color={event.color} />
                      <div className="w-full md:w-96 my-2">
                        <h6 className="text-lg md:text-sm font-bold">
                          {event.title || 'Error al obtener titulo'}
                        </h6>
                        <p>
                          {event.type !== 'ov'
                            ? `${truncate(event.description, 140)}`
                            : ''}
                        </p>
                        {event.type === 'ov' && (
                          <div className="w-full md:w-auto">
                            <p>
                              Recordatorio:{' '}
                              {truncate(event?.description, 140) ||
                                'Error al obtener descripción'}
                            </p>
                            <div>
                              <p>
                                Propiedad:{' '}
                                {event?.propertyName ||
                                  'Error al obtener nombre propiedad'}
                              </p>
                              {event?.customer && (
                                <p>
                                  {' '}
                                  Cliente: {event.customer?.name}{' '}
                                  {event.customer?.lastName}
                                </p>
                              )}
                              {event?.alias && <p>Alias: {event?.alias}</p>}
                              {/*                                                         cutomerName: order?.customer && ${order.customer?.name} ${order.customer?.lastName} ?? '',customerAlias: order?.alias ?? '' */}

                              {/* <p>Cliente: {event?.customerName || 'Error al obtener nombre cliente'}</p> */}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 items-center md:w-44">
                      {/* <span className=''>{new Date(event?.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>              
                                <span className=''>{new Date(event?.date).toLocaleTimeString('es-ES', { hour:'numeric', minute:'numeric'})} hrs</span>               */}
                      <span className="text-sm">
                        {new Date(event?.date).toLocaleString('es-ES', {
                          timeZone: 'UTC',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          //second: '2-digit',
                        })}{' '}
                        hrs
                      </span>
                    </div>
                  </div>
                ))
              : ''}
            {filteredEvents.length === 0 ? (
              <div className="items-center gap-3 mt-7">
                <h6 className="text-sm font-medium text-center mx-auto mb-3">
                  No hay eventos creados para este día
                </h6>
              </div>
            ) : (
              ''
            )}
          </div>
          {openDialog.create && (
            <CreateEventDialog
              openDialog={openDialog.create}
              closeDialogs={closeDialogs}
              selectedDate={selectedDate}
            />
          )}

          {openDialog.update && (
            <EditEventDialog
              openDialog={openDialog.update}
              closeDialogs={closeDialogs}
              eventData={selectedEvent}
            />
          )}

          {openDialogVisOrd.createVisitOrder && (
            <CreateVisitOrderDialog
              openDialogVisOrd={openDialogVisOrd.createVisitOrder}
              closeDialogsVisOrd={closeDialogsVisOrd}
              selectedDate={selectedDate}
            />
          )}

          {openDialogVisOrd.updateVisitOrder && (
            <EditVisitOrderDialog
              openDialogVisOrd={openDialogVisOrd.updateVisitOrder}
              closeDialogsVisOrd={closeDialogsVisOrd}
              eventData={selectedEvent}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ScheduleCalendar
