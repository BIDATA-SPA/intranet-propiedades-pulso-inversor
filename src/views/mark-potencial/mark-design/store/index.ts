import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, { BrandsListState, SLICE_NAME } from './brandListSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: BrandsListState
    }
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './brandListSlice'
export default reducer
