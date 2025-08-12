import { Colors } from '@/constants/colors.contant'

export type Calendar = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

export type VisitOrd = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId: number | null
  propertyId: number | null
}[]

// post
export type CreateEventCalendar = {
  id?: string
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}[]

export type CreateVisitOrd = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId: number | null
  propertyId: number | null
}

// patch
export type PatchEventCalendar = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

export type PatchVisitOrd = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

// get
export type GetEventCalendar = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

export type GetVisitOrd = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

// FormModels
export type CalendarFormModel = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}

export type VisitOrdFormModel = {
  title: string
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  description: string
  eventColor: Colors
  eventType: 'event' | 'visit order'
  customerId?: number | null
  propertyId?: number | null
}
