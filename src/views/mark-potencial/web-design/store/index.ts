import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, { SLICE_NAME, WebDesignsListState } from './webDesignListSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: WebDesignsListState
    }
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './webDesignListSlice'
export default reducer
