import { Dropdown } from '@/components/ui'
import Badge from '@/components/ui/Badge'
import Calendar from '@/components/ui/Calendar'
import Card from '@/components/ui/Card'
import {
  useGetEventsQuery,
  useGetVisitOrderQuery,
} from '@/services/RtkQueryService'
import useThemeClass from '@/utils/hooks/useThemeClass'
import EditEventDialog from '@/views/calendario/components/EditEventDialog'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FaFileSignature } from 'react-icons/fa'
import { HiDocumentText } from 'react-icons/hi'
import { LuCalendarPlus } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import UseDialog from '../../../views/calendario/hooks/useDialogs'

type CombinedDataType = {
  id: string
  date: string
  title: string
  description: string
  type: string
  status: []
  color: string
  customerId?: string
  propertyId?: string
  customerName: string
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
  const [filterTask, setFilterTask] = useState('mensual')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CombinedDataType | null>(
    null
  )
  const { textTheme } = useThemeClass()
  const { openDialog, openUpdateDialog, closeDialogs } = UseDialog()

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

  const handleClickFilter = (filteredSelect: string) => {
    setFilterTask(filteredSelect)
  }

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  useEffect(() => {
    if (eventData && orderData) {
      const combined = [
        ...eventData.map((event) => ({ ...event, type: 'task' })),
        ...orderData.map((order) => ({
          ...order,
          type: 'ov',
          customerName: `${order?.customer?.name} ${order?.customer?.lastName}`,
          propertyName: order?.property?.propertyTitle,
        })),
      ]
      setCombined(combined)
    }
  }, [eventData, orderData])

  useEffect(() => {
    if (value) {
      const filtered = combined.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === value.toDateString()
      })
      setFilteredEvents(filtered)
    }
  }, [value, combined])

  const handleEditEvent = (event: CombinedDataType) => {
    setSelectedEvent(event)
    openUpdateDialog()
  }

  useEffect(() => {
    setFilteredEvents(filterEvents(combined, filterTask))
  }, [combined, filterTask, selectedDate])

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
          dayStyle={() => {
            return { height: 48 }
          }}
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
          }}
        />
      </div>
      <hr className="my-3" />
      <div className="flex flex-row justify-between mb-2 items-center">
        <h5 className="">Mi Agenda</h5>
        <Link
          to="/mi-calendario"
          className="bg-lime-200 p-2 rounded-md text-lime-600 hover:scale-105 duration-200 font-medium"
        >
          <LuCalendarPlus className="text-lg" title="Ir Calendario" />
        </Link>
      </div>
      <div className="flex flex-row justify-between  mb-4 items-center">
        <div className="flex items-center">
          <span className="font-medium">Ordenar</span>
          <Dropdown title={filterTask} trigger="hover">
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
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      {new Date(event.date).toLocaleTimeString('es-ES', {
                        timeZone: 'UTC',
                        hour: '2-digit',
                        minute: 'numeric',
                      })}{' '}
                      hrs
                    </span>
                  </div>
                  <p className="text-sm">{truncate(event?.description, 139)}</p>
                  {event.type === 'ov' && (
                    <div className="text-sm">
                      <span>
                        Propiedad:{' '}
                        {event?.propertyName ||
                          'Error al obtener nombre propiedad'}
                      </span>
                      <span>
                        Cliente:{' '}
                        {event?.customerName ||
                          'Error al obtener nombre cliente'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="items-center gap-3 mt-7">
            <h6 className="text-sm font-medium text-center mx-auto">
              No hay eventos creados para este día
            </h6>
          </div>
        )}
      </div>
      {openDialog.update && (
        <EditEventDialog
          openDialog={openDialog.update}
          closeDialogs={closeDialogs}
          eventData={selectedEvent}
        />
      )}
    </Card>
  )
}

export default Schedule
