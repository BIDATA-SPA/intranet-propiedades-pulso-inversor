import type { RootState } from '@/store'
import { combineReducers } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector } from 'react-redux'
import reducers, {
    SLICE_NAME,
    ToolsAndServicesState,
} from './toolsAndServicesSlice'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: ToolsAndServicesState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export * from './toolsAndServicesSlice'
export default reducer
