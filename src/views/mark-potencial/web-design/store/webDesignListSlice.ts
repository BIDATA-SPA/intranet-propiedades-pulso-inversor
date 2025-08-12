// src/views/my-properties/store/propertyListSlice.ts
import { ServiceRequest } from '@/services/marketing/brand/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'webDesignsList'

export interface WebDesignsListState {
  webDesigns: ServiceRequest[]
  page: number
  limit: number
  totalItems: number
  loading: boolean
}

const initialState: WebDesignsListState = {
  webDesigns: [],
  page: 1,
  limit: 5,
  totalItems: 0,
  loading: false,
}

const webDesignsListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setWebDesigns: (state, action: PayloadAction<ServiceRequest[]>) => {
      state.webDesigns = action.payload
    },
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setWebDesigns,
  setPageIndex,
  setPageSize,
  setTotalItems,
  setLoading,
} = webDesignsListSlice.actions

export default webDesignsListSlice.reducer
