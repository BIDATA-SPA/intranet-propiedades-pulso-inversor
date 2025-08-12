import { IRatingUser } from '@/@types/modules/rating-user.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'ratingUserList'

export interface RatingUserFilters {
  search: string
  [key: string]: string | number | boolean
}

export interface RatingUserListState {
  ratingUsers: IRatingUser[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  previousPageUrl: string | null
  nextPageUrl: string | null
  loading: boolean
  viewMode: 'list' | 'grid'
  selectedRow: Partial<IRatingUser>
  emailDialogOpen: boolean
  filters: RatingUserFilters
}

const initialState: RatingUserListState = {
  ratingUsers: [],
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
    paginated: true,
  },
}

const ratingUserListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setRatingUserData: (
      state,
      action: PayloadAction<{
        ratingUsers: IRatingUser[]
        page: number
        limit: number
        totalItems: number
        totalPages: number
        previousPageUrl: string | null
        nextPageUrl: string | null
      }>
    ) => {
      const {
        ratingUsers,
        page,
        limit,
        totalItems,
        totalPages,
        previousPageUrl,
        nextPageUrl,
      } = action.payload

      state.ratingUsers = ratingUsers
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
    setFilters: (state, action: PayloadAction<Partial<RatingUserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list'
    },
  },
})

export const {
  setRatingUserData,
  setPageIndex,
  setPageSize,
  setLoading,
  toggleEmailDialog,
  setFilters,
  toggleViewMode,
  setSelectedRow,
} = ratingUserListSlice.actions

export default ratingUserListSlice.reducer
