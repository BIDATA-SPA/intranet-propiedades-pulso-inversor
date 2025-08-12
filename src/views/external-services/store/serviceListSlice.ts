import { createSlice } from '@reduxjs/toolkit'

type Query = {
    search: ''
}

export type ServiceListState = {
    loading: boolean
    selectedService: string | undefined
    serviceList: any[]
    view: 'grid' | 'list'
    query: Query
}

export const SLICE_NAME = 'serviceList'

const initialState: ServiceListState = {
    loading: false,
    // deleteConfirmation: false,
    selectedService: '',
    serviceList: [],
    view: 'grid',
    query: {
        search: '',
    },
}

const serviceListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setSelectedService: (state, action) => {
            state.selectedService = action.payload
        },
        toggleView: (state, action) => {
            state.view = action.payload
        },
        setSearch: (state, action) => {
            state.query.search = action.payload
        },
    },
})

export const { setSelectedService, toggleView, setSearch } =
    serviceListSlice.actions
export default serviceListSlice.reducer
