import { Property } from '@/@types/modules/property.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'propertiesList'

export interface PropertiesListState {
  properties: Property[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  previousPageUrl: string | null
  nextPageUrl: string | null
  loading: boolean
  viewMode: 'list' | 'grid'
  filters: {
    search: string
    inExchange: boolean
    sold: boolean
    deRegistered: boolean
    disabled: boolean
    favorites: boolean
    orderById: 'asc' | 'desc'
    orderByPrice: 'asc' | 'desc'
    [key: string]: string | number | boolean
  }
  sort: {
    field: string
    direction: 'asc' | 'desc'
  }
}

const initialState: PropertiesListState = {
  properties: [],
  page: 1,
  limit: 5,
  totalItems: 0,
  totalPages: 0,
  previousPageUrl: null,
  nextPageUrl: null,
  loading: false,
  viewMode: 'list',
  filters: {
    search: '',
    inExchange: false,
    sold: false,
    deRegistered: false,
    disabled: false,
    favorites: false,
    orderById: 'desc',
    orderByPrice: 'asc',
    currencyId: '',
  },
  sort: {
    field: '',
    direction: 'asc',
  },
}

const propertiesListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setPropertiesData: (state, action: PayloadAction<PropertiesListState>) => {
      const {
        properties,
        page,
        limit,
        totalItems,
        totalPages,
        previousPageUrl,
        nextPageUrl,
      } = action.payload

      state.properties = properties
      state.page = page
      state.limit = limit
      state.totalItems = totalItems
      state.totalPages = totalPages
      state.previousPageUrl = previousPageUrl
      state.nextPageUrl = nextPageUrl
      state.loading = false
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list'
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<{ [key: string]: string | number | boolean }>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const {
  setPropertiesData,
  setPageIndex,
  setPageSize,
  toggleViewMode,
  setLoading,
  setFilters,
} = propertiesListSlice.actions

export default propertiesListSlice.reducer
