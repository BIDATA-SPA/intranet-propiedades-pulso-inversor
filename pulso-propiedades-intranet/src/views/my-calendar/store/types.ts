import { Colors } from '@/constants/colors.contant'

export type Event = {
  id: string
  eventColor: Colors
  title: string
  description: string
  propertyId?: {
    id: string | number
    proprtyTitle: string
  }
  createdByUser?: {
    id: string
    name: string
    lastName: string
  }
  customer?: {
    id: string | number
    name: string
    lastName: string
  }
  status: {
    id: number
    name: string
  }
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  eventType: 'event' | 'visit order'
  type: {
    id: number
    name: 'Evento'
  }
}

export type VisitOrder = {
  id: string
  eventColor: Colors
  title: string
  description: string
  propertyId?: {
    id: string | number
    proprtyTitle: string
  }
  createdByUser?: {
    id: string
    name: string
    lastName: string
  }
  customer?: {
    id: string | number
    name: string
    lastName: string
  }
  status: {
    id: number
    name: string
  }
  start: string | Date
  startTime: string | Date
  end: string | Date
  endTime: string | Date
  eventType: 'event' | 'visit order'
  type: {
    id: number
    name: 'Evento'
  }
}
