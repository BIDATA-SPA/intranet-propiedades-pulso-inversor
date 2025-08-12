import { IReferredRealtor } from '@/@types/modules/referred-realtor.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'referredRealtorList'

export interface ReferredRealtorFilters {
  search: string
  [key: string]: string | number | boolean
}

export interface ReferredRealtorListState {
  realtors: IReferredRealtor[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  previousPageUrl: string | null
  nextPageUrl: string | null
  loading: boolean
  viewMode: 'list' | 'grid'
  selectedRow: Partial<IReferredRealtor>
  emailDialogOpen: boolean
  filters: ReferredRealtorFilters
}

const initialState: ReferredRealtorListState = {
  realtors: [],
  page: 1,
  limit: 5,
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
  },
}

const referredRealtorListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setReferredRealtorsData: (
      state,
      action: PayloadAction<{
        realtors: IReferredRealtor[]
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
      action: PayloadAction<Partial<ReferredRealtorFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list'
    },
  },
})

export const {
  setReferredRealtorsData,
  setPageIndex,
  setPageSize,
  setLoading,
  toggleEmailDialog,
  setFilters,
  toggleViewMode,
  setSelectedRow,
} = referredRealtorListSlice.actions

export default referredRealtorListSlice.reducer
