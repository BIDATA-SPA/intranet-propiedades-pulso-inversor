import { Property } from '@/@types/modules/property.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'propertiesResumeList'

export interface PropertiesResumeListState {
  propertiesResume: Property[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  previousPageUrl: string | null
  nextPageUrl: string | null
  loading: boolean
  viewMode: 'list' | 'grid'
  sort: {
    direction: 'asc' | 'desc'
  }
}

const initialState: PropertiesResumeListState = {
  propertiesResume: [],
  page: 1,
  limit: 12,
  totalItems: 0,
  totalPages: 0,
  previousPageUrl: null,
  nextPageUrl: null,
  loading: false,
  viewMode: 'grid',
  sort: {
    direction: 'asc',
  },
}

const propertiesResumeListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setPropertiesResumeData: (
      state,
      action: PayloadAction<PropertiesResumeListState>
    ) => {
      const {
        propertiesResume,
        page,
        limit,
        totalItems,
        totalPages,
        previousPageUrl,
        nextPageUrl,
      } = action.payload

      state.propertiesResume = propertiesResume
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
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'list' ? 'grid' : 'list'
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setPropertiesResumeData,
  setPageIndex,
  setPageSize,
  toggleViewMode,
  setLoading,
} = propertiesResumeListSlice.actions

export default propertiesResumeListSlice.reducer
