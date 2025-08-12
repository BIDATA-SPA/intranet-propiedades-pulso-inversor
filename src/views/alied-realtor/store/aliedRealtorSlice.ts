import { IRealtor } from '@/@types/modules/aliated-realtor.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'aliedRealtorList'

export interface AliedRealtorFilters {
  search: string
  orderByRating: 'asc' | 'desc'
  [key: string]: string | number | boolean
}

export interface AliedRealtorListState {
  realtors: IRealtor[]
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
  filters: AliedRealtorFilters
}

const initialState: AliedRealtorListState = {
  realtors: [],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  previousPageUrl: null,
  nextPageUrl: null,
  loading: false,
  viewMode: 'grid',
  emailDialogOpen: false,
  selectedRow: {},
  filters: {
    search: '',
    orderByRating: 'desc',
  },
}

const aliedRealtorListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setAliedRealtorsData: (
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
        realtors,
        page,
        limit,
        totalItems,
        totalPages,
        previousPageUrl,
        nextPageUrl,
      } = action.payload

      state.realtors = realtors
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
      action: PayloadAction<Partial<AliedRealtorFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list'
    },
  },
})

export const {
  setAliedRealtorsData,
  setPageIndex,
  setPageSize,
  setLoading,
  toggleEmailDialog,
  setFilters,
  toggleViewMode,
  setSelectedRow,
} = aliedRealtorListSlice.actions

export default aliedRealtorListSlice.reducer
