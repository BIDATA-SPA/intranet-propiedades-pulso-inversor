import type { RootState } from '@/store'
import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'
import reducers, { RatingUserListState, SLICE_NAME } from './ratingUserSlice'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: RatingUserListState
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './ratingUserSlice'
export default reducer
