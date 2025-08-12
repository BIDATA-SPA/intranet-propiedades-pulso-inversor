import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, { CampaignsListState, SLICE_NAME } from './campaignListSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
  data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: CampaignsListState
    }
  }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './campaignListSlice'
export default reducer
