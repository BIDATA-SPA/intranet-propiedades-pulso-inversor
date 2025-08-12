import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, {
  ReferredRealtorListState,
  SLICE_NAME,
} from './referredRealtorSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: ReferredRealtorListState
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './referredRealtorSlice'
export default reducer
