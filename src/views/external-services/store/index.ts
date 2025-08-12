import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import reducers, { SLICE_NAME, ServiceListState } from './serviceListSlice'

import type { RootState } from '@/store'
import type { TypedUseSelectorHook } from 'react-redux'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: ServiceListState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './serviceListSlice'
export default reducer
