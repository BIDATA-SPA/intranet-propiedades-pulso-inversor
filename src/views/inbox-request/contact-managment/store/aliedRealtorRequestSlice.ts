import { IRealtor } from '@/@types/modules/aliated-realtor.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'aliedRealtorRequestList'

export interface AliedRealtorRequestFilters {
  search: string
  filterType: 'all' | 'sent' | 'received'
  [key: string]: string | number | boolean
}

export interface AliedRealtorRequestListState {
  requests: IRealtor[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  previousPageUrl: string | null
  nextPageUrl: string | null
  loading: boolean
  viewMode: 'list' | 'grid'
  selectedRow: Partial<IRealtor>
  emailDialogOpen: boolean
  filters: AliedRealtorRequestFilters
}

const initialState: AliedRealtorRequestListState = {
  requests: [],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  previousPageUrl: null,
  nextPageUrl: null,
  loading: false,
  viewMode: 'list',
  emailDialogOpen: false,
  selectedRow: {},
  filters: {
    search: '',
    filterType: 'all',
  },
}

const aliedRealtorRequestListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setAliedRealtorsRequestData: (
      state,
      action: PayloadAction<{
        realtors: IRealtor[]
        page: number
        limit: number
        totalItems: number
        totalPages: number
        previousPageUrl: string | null
        nextPageUrl: string | null
      }>
    ) => {
      const {
        requests,
        page,
        limit,
        totalItems,
        totalPages,
        previousPageUrl,
        nextPageUrl,
      } = action.payload

      state.requests = requests
      state.page = page
      state.limit = limit
      state.totalItems = totalItems
      state.totalPages = totalPages
      state.previousPageUrl = previousPageUrl
      state.nextPageUrl = nextPageUrl
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    toggleEmailDialog: (state, action) => {
      state.emailDialogOpen = action.payload
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<AliedRealtorRequestFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filters.filterType = action.payload
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list'
    },
  },
})

export const {
  setAliedRealtorsRequestData,
  setPageIndex,
  setPageSize,
  setLoading,
  toggleEmailDialog,
  setFilters,
  setFilterType,
  toggleViewMode,
  setSelectedRow,
} = aliedRealtorRequestListSlice.actions

export default aliedRealtorRequestListSlice.reducer
