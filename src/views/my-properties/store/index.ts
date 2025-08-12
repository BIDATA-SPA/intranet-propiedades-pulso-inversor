import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, { PropertiesListState, SLICE_NAME } from './propertyListSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: PropertiesListState
    }
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './propertyListSlice'
export default reducer
