import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, { CalendarState, SLICE_NAME } from './calendarSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: CalendarState
    }
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './calendarSlice'
export default reducer
