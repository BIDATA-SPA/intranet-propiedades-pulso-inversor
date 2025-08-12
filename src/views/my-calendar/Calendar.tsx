import CalendarView from '@/components/shared/CalendarView'
import Container from '@/components/shared/Container'
import {
  useCreateEventMutation,
  useCreateVisitOrderMutation,
  useGetEventsQuery,
  useGetVisitOrderQuery,
  usePatchEventMutation,
  usePatchVisitOrderMutation,
} from '@/services/RtkQueryService'
import { injectReducer } from '@/store'
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import EventDialog, { EventParam } from './components/EventDialog'
import reducer, {
  openDialog,
  setSelected,
  updateEvent,
  useAppDispatch,
  useAppSelector,
} from './store'

injectReducer('crmCalendar', reducer)

const transformEventData = (event) => {
  return {
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    color: event.color,
    extendedProps: {
      description: event.description,
      propertyId: event.propertyId,
      customer: event.customer,
      startTime: event.startTime,
      endTime: event.endTime,
      eventType: event.eventType,
    },
  }
}

const Calendar = () => {
  const dispatch = useAppDispatch()
  const eventList = useAppSelector((state) => state.crmCalendar.data.eventList)

  const { data: events } = useGetEventsQuery()
  const { data: visitOrders } = useGetVisitOrderQuery()
  const [createEvent] = useCreateEventMutation()
  const [patchEvent] = usePatchEventMutation()
  const [createVisitOrder] = useCreateVisitOrderMutation()
  const [patchVisitOrder] = usePatchVisitOrderMutation()

  useEffect(() => {
    if (events?.length || visitOrders?.length) {
      const transformedEvents = [
        ...(events || []).map(transformEventData),
        ...(visitOrders || []).map(transformEventData),
      ]

      dispatch(updateEvent(transformedEvents))
    } else {
      dispatch(updateEvent([]))
    }
  }, [events, visitOrders, dispatch])

  const onCellSelect = (event: DateSelectArg) => {
    const { start, end } = event

    dispatch(
      setSelected({
        type: 'NEW',
        start: dayjs(start).toISOString(),
        end: dayjs(end).toISOString(),
      })
    )
    dispatch(openDialog())
  }

  const onEventClick = (arg: EventClickArg) => {
    const { start, end, id, title, extendedProps } = arg.event

    dispatch(
      setSelected({
        type: 'EDIT',
        id,
        title,
        start: start ? dayjs(start).toISOString() : null,
        end: end ? dayjs(end).toISOString() : null,
        startTime: extendedProps.startTime
          ? dayjs(extendedProps.startTime).format('HH:mm')
          : '09:00',
        endTime: extendedProps.endTime
          ? dayjs(extendedProps.endTime).format('HH:mm')
          : '09:00',
        color: extendedProps.color,
        description: extendedProps.description,
        eventType: extendedProps.eventType || 'event',
        customerId: extendedProps.customer?.id || null,
        propertyId: extendedProps.propertyId || null,
      })
    )

    dispatch(openDialog())
  }

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

    const _data = {
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
      const data = _data

      if (eventType === 'event') {
        if (type === 'NEW') {
          await createEvent(data)
        } else if (type === 'EDIT') {
          await patchEvent({ id: Number(formData.id), ...data })
        }
      } else if (eventType === 'visit order') {
        const data = {
          ..._data,
          customerId,
          propertyId,
        }

        if (type === 'NEW') {
          await createVisitOrder(data)
        } else if (type === 'EDIT') {
          await patchVisitOrder({ id: Number(formData.id), ...data })
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  const onEventChange = (arg: EventDropArg) => {
    const newEvents = cloneDeep(events).map((event) => {
      if (arg.event.id === event.id) {
        const { id, extendedProps, start, end, title } = arg.event

        // Validar fechas antes de formatearlas
        const validStart = dayjs(start).isValid() ? dayjs(start).format() : null
        const validEnd = dayjs(end).isValid() ? dayjs(end).format() : null

        event = {
          id,
          start: validStart || new Date().toISOString(), // Valor por defecto si no es válido
          end: validEnd || new Date().toISOString(), // Valor por defecto si no es válido
          title,
          description: extendedProps.description,
          color: extendedProps.color,
        }
      }
      return event
    })

    dispatch(updateEvent(newEvents))
  }

  return (
    <Container className="h-full">
      <CalendarView
        editable
        selectable
        events={eventList}
        eventClick={onEventClick}
        select={onCellSelect}
        eventDrop={onEventChange}
      />
      <EventDialog submit={onSubmit} />
    </Container>
  )
}

export default Calendar
