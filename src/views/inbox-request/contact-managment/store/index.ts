import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, {
  AliedRealtorRequestListState,
  SLICE_NAME,
} from './aliedRealtorRequestSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: AliedRealtorRequestListState
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './aliedRealtorRequestSlice'
export default reducer
