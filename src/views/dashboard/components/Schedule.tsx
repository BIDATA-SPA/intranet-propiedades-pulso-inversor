import { Dropdown } from '@/components/ui'
import Badge from '@/components/ui/Badge'
import Calendar from '@/components/ui/Calendar'
import Card from '@/components/ui/Card'
import {
  useCreateEventMutation,
  useCreateVisitOrderMutation,
  useGetEventsQuery,
  useGetVisitOrderQuery,
  usePatchEventMutation,
  usePatchVisitOrderMutation,
} from '@/services/RtkQueryService'
import { injectReducer, useAppDispatch, useAppSelector } from '@/store'
import useNotification from '@/utils/hooks/useNotification'
import useThemeClass from '@/utils/hooks/useThemeClass'
import reducer from '@/views/my-calendar/store'
import {
  openDialogSchedule,
  setSelected,
} from '@/views/my-calendar/store/calendarSlice'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FaFileSignature } from 'react-icons/fa'
import { HiDocumentText } from 'react-icons/hi'
import { LuCalendarPlus } from 'react-icons/lu'
import { Link, useNavigate } from 'react-router-dom'
import EventDialog, { EventParam } from './EventDialog'

injectReducer('crmCalendar', reducer)

type CombinedDataType = {
  id: string
  title: string
  description: string
  color: string
  type: 'task' | 'ov'
  start: string
  startTime: string
  end: string
  endTime: string
  customerId?: string
  propertyId?: string
  customerName?: string
  propertyName?: string
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

const Schedule = () => {
  const [combined, setCombined] = useState<CombinedDataType[]>([])
  const [value, setValue] = useState<Date>(new Date())
  const [filteredEvents, setFilteredEvents] = useState<CombinedDataType[]>([])
  const [filterTask, setFilterTask] = useState('Mensual')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CombinedDataType | null>(
    null
  )
  const { textTheme } = useThemeClass()
  const dispatch = useAppDispatch()
  const isDialogOpen = useAppSelector(
    (state) => state.crmCalendar.data.dialogOpenSchedule
  )
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [createEvent] = useCreateEventMutation()
  const [patchEvent] = usePatchEventMutation()
  const [createVisitOrder] = useCreateVisitOrderMutation()
  const [patchVisitOrder] = usePatchVisitOrderMutation()

  const { data: eventData } = useGetEventsQuery()
  const { data: orderData } = useGetVisitOrderQuery()

  const today = new Date()

  const getStartEndOfWeek = () => {
    const startWeek = new Date(today)
    startWeek.setDate(today.getDate() - today.getDay())

    const endWeek = new Date(today)
    endWeek.setDate(today.getDate() - today.getDay() + 6)

    return { startWeek, endWeek }
  }

  const getStartEndOfMonth = () => {
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return { startMonth, endMonth }
  }

  const filterEvents = (events: CombinedDataType[], filtro: string) => {
    const { startWeek, endWeek } = getStartEndOfWeek()
    const { startMonth, endMonth } = getStartEndOfMonth()

    switch (filtro) {
      case 'Diaria':
        return events.filter((event) => {
          const date = new Date(event.start)
          return date.toDateString() === today.toDateString()
        })
      case 'Semanal':
        return events.filter((event) => {
          const date = new Date(event.start)
          return date >= startWeek && date <= endWeek
        })
      case 'Mensual':
        return events.filter((event) => {
          const date = new Date(event.start)
          return date >= startMonth && date <= endMonth
        })
      default:
        return events
    }
  }

  const handleClickFilter = (filteredSelect: string) => {
    setFilterTask(filteredSelect)
  }

  const handleEditEvent = (event: CombinedDataType) => {
    setSelectedEvent(event)
    dispatch(
      setSelected({
        id: event.id,
        title: event.title,
        start: event.date,
        end: event.date,
        startTime: event.date,
        endTime: event.date,
        description: event.description,
        eventColor: event.color,
        eventType: event.type === 'ov' ? 'visit order' : 'event',
        customerId: Number(event.customerId) || null,
        propertyId: Number(event.propertyId) || null,
        type: 'UPDATE',
      })
    )
    dispatch(openDialogSchedule())
  }

  const handleCreateEvent = (date: Date) => {
    const startDate = new Date(date)
    startDate.setHours(9, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(10, 0, 0)

    const newEvent: EventParam = {
      id: '',
      title: '',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      description: '',
      eventColor: 'blue',
      eventType: 'event',
      customerId: null,
      propertyId: null,
      type: 'NEW',
    }

    dispatch(setSelected(newEvent))
    dispatch(openDialogSchedule())
  }

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  useEffect(() => {
    if (eventData && orderData) {
      const unifiedEvents: CombinedDataType[] = [
        ...eventData.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          color: event.color,
          start: event.start,
          startTime: event.startTime,
          end: event.end,
          endTime: event.endTime,
          type: 'task',
          customerId: event.customer?.id || '',
          propertyId: event.propertyId || '',
          customerName: event.customer
            ? `${event.customer.name} ${event.customer.lastName}`
            : '',
          propertyName: '', // los "event" no traen objeto property
        })),
        ...orderData.map((order) => ({
          id: order.id,
          title: order.title,
          description: order.description,
          color: order.color,
          start: order.start,
          startTime: order.startTime,
          end: order.end,
          endTime: order.endTime,
          type: 'ov',
          customerId: order.customer?.id || '',
          propertyId: order.propertyId || '',
          customerName: order.customer
            ? `${order.customer.name} ${order.customer.lastName}`
            : '',
          propertyName: order.property?.propertyTitle || '',
        })),
      ]

      setCombined(unifiedEvents)
    }
  }, [eventData, orderData])

  useEffect(() => {
    setFilteredEvents(filterEvents(combined, filterTask))
  }, [combined, filterTask, selectedDate])

  const onSubmit = async (formData: EventParam, type: string) => {
    const {
      eventType,
      title,
      start,
      startTime,
      end,
      endTime,
      description,
      eventColor,
      customerId,
      propertyId,
    } = formData

    const baseData = {
      title,
      start,
      startTime,
      end,
      endTime,
      description,
      eventColor,
      eventType,
    }

    try {
      if (eventType === 'event') {
        if (type === 'NEW') {
          await createEvent(baseData).unwrap()
          showNotification('success', 'Exito', 'Evento creado exitosamente')
          navigate('/mi-calendario')
        } else if (type === 'UPDATE') {
          await patchEvent({ id: Number(formData.id), ...baseData }).unwrap()
          showNotification(
            'success',
            'Exito',
            'Evento actualizado exitosamente'
          )
          navigate('/mi-calendario')
        }
      } else if (eventType === 'visit order') {
        const visitOrderData = {
          ...baseData,
          customerId,
          propertyId,
        }

        if (type === 'NEW') {
          await createVisitOrder(visitOrderData).unwrap()
          showNotification(
            'success',
            'Exito',
            'Orden de visita creada correctamente'
          )
          navigate('/mi-calendario')
        } else if (type === 'UPDATE') {
          await patchVisitOrder({
            id: Number(formData.id),
            ...visitOrderData,
          }).unwrap()
          showNotification(
            'success',
            'Exito',
            'Orden de visita actualizada correctamente'
          )
          navigate('/mi-calendario')
        }
      }
    } catch (error) {
      showNotification('danger', 'Exito', `${error || 'Ha ocurrido un error'}`)
    }
  }

  return (
    <Card className="mb-4 shadow-md md:max-h-full 2xl:max-h-[90vh] overflow-hidden pb-2">
      <div className="mx-auto 2xl:max-w-[420px]">
        <Calendar
          locale="es"
          value={selectedDate}
          dayClassName={(date, { selected }) => {
            const defaultClass = 'text-base'
            if (isToday(date) && !selected) {
              return classNames(defaultClass, textTheme)
            }
            if (selected) {
              return classNames(defaultClass, 'text-white')
            }
            return defaultClass
          }}
          dayStyle={() => ({ height: 48 })}
          renderDay={(date) => {
            const day = date.getDate()
            const hasEvents = combined.some((eventDay) => {
              const eventDate = new Date(eventDay.date)
              return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
              )
            })
            return (
              <span className="relative flex justify-center items-center w-full h-full">
                {day}
                {hasEvents && (
                  <Badge
                    className="absolute bottom-1 bg-yellow-600"
                    innerClass="h-1 w-2"
                  />
                )}
              </span>
            )
          }}
          onChange={(val) => {
            setValue(val)
            setSelectedDate(val)
            handleCreateEvent(val)
          }}
        />
      </div>

      <hr className="my-3" />
      <div className="flex justify-between mb-2 items-center">
        <h5>Mi Agenda</h5>
        <Link
          to="/mi-calendario"
          className="bg-sky-200 p-2 rounded-md text-sky-600 hover:scale-105 duration-200 font-medium"
        >
          <LuCalendarPlus className="text-lg" title="Ir Calendario" />
        </Link>
      </div>

      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center">
          <span className="font-medium">Ordenar</span>
          <Dropdown title={filterTask} trigger="hover">
            <Dropdown.Item
              eventKey="Diaria"
              onSelect={() => handleClickFilter('Diaria')}
            >
              Diarias
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="Semanal"
              onSelect={() => handleClickFilter('Semanal')}
            >
              Semanales
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="Mensual"
              onSelect={() => handleClickFilter('Mensual')}
            >
              Mensuales
            </Dropdown.Item>
          </Dropdown>
        </div>
        <p>{filteredEvents.length} Eventos</p>
      </div>

      <div className="h-[300px] 2xl:h-[280px] pr-1 overflow-y-auto">
        {filteredEvents.length !== 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between mb-2 hover:bg-gray-50 hover:scale-95 duration-150 dark:hover:bg-gray-600/40 cursor-pointer user-select border-b-2"
              onClick={() => handleEditEvent(event)}
            >
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2 md:mb-1 md:w-full">
                <EventIcon type={event.type} color={event.color} />
                <div className="w-full md:w-96">
                  <h6 className="text-lg md:text-sm font-bold">
                    {event.title}
                  </h6>
                  <div className="flex flex-row gap-1 text-center">
                    <span>
                      {new Date(event.start).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      {new Date(event.start).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      hrs
                    </span>
                  </div>
                  <p className="text-sm">{truncate(event?.description, 139)}</p>
                  {event.type === 'ov' && (
                    <div className="text-sm">
                      <span>
                        Propiedad:{' '}
                        {event?.propertyName || 'Error al obtener nombre'}
                      </span>
                      <span>
                        Cliente:{' '}
                        {event?.customerName || 'Error al obtener cliente'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-7">
            <h6 className="text-sm font-medium">
              No hay eventos creados para este día
            </h6>
          </div>
        )}
      </div>

      {isDialogOpen && <EventDialog submit={onSubmit} />}
    </Card>
  )
}

export default Schedule
