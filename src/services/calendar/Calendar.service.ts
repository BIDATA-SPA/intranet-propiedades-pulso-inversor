import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { Calendar, CreateEventCalendar } from './types/calendar.type'

// services/calendarService.ts
export const getCalendarEventsQuery = (builder: EndpointBuilderType) => ({
  createEvent: builder.mutation<Calendar, CreateEventCalendar>({
    query: (body) => ({ url: 'calendar', method: 'POST', data: body }),
    invalidatesTags: ['Events'],
  }),
  patchEvent: builder.mutation<Calendar, Partial<CreateEventCalendar>>({
    query: ({ id, ...body }) => ({
      url: `calendar/${id}`,
      method: 'PATCH',
      data: body,
    }),
    invalidatesTags: ['Events'],
  }),
  getEvents: builder.query<Calendar[], void>({
    query: () => ({ url: 'calendar', method: 'GET' }),
    providesTags: ['Events'],
  }),

  createVisitOrder: builder.mutation<Calendar, CreateEventCalendar>({
    query: (body) => ({
      url: 'calendar/visit-order',
      method: 'POST',
      data: body,
    }),
    invalidatesTags: ['VisitOrders'],
  }),
  patchVisitOrder: builder.mutation<Calendar, Partial<CreateEventCalendar>>({
    query: ({ id, ...body }) => ({
      url: `calendar/visit-order/${id}`,
      method: 'PATCH',
      data: body,
    }),
    invalidatesTags: ['VisitOrders'],
  }),
  getVisitOrders: builder.query<Calendar[], void>({
    query: () => ({ url: 'calendar/visit-order', method: 'GET' }),
    providesTags: ['VisitOrders'],
  }),
})
