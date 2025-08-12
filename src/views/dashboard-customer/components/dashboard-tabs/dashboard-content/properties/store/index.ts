import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, {
  PropertiesResumeListState,
  SLICE_NAME,
} from './resumePropertySlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: PropertiesResumeListState
    }
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './resumePropertySlice'
export default reducer
