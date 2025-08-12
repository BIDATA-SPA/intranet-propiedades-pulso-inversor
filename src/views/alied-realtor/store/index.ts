import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, {
  AliedRealtorListState,
  SLICE_NAME,
} from './aliedRealtorSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: AliedRealtorListState
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './aliedRealtorSlice'
export default reducer
