import { createSlice } from '@reduxjs/toolkit'

type Event = {
  id: string
  title: string
  start: string
  end?: string
  color: string
  startTime: string
  endTime: string
  description: string
  eventType: 'event' | 'visit order'
  customerId: number | null
  propertyId: number | null
}

type Events = Event[]

export type CalendarState = {
  loading: boolean
  eventList: Events
  dialogOpen: boolean
  selected: {
    type: string
  } & Partial<Event>
}

export const SLICE_NAME = 'crmCalendar'

const initialState: CalendarState = {
  loading: false,
  eventList: [],
  dialogOpen: false,
  selected: {
    type: '',
    id: null,
    title: '',
    start: '',
    end: '',
    color: '',
    startTime: '',
    endTime: '',
    description: '',
    eventType: 'event',
    customerId: null,
    propertyId: null,
  },
}

const calendarSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    updateEvent: (state, action) => {
      state.eventList = action.payload
    },
    openDialog: (state) => {
      state.dialogOpen = true
    },
    closeDialog: (state) => {
      state.dialogOpen = false
    },
    setSelected: (state, action) => {
      state.selected = action.payload
    },
  },
})

export const { updateEvent, openDialog, closeDialog, setSelected } =
  calendarSlice.actions

export default calendarSlice.reducer
