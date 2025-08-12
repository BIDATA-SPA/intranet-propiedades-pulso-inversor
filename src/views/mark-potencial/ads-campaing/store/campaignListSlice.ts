// src/views/my-properties/store/propertyListSlice.ts
import { ServiceRequest } from '@/services/marketing/brand/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'campaignsList'

export interface CampaignsListState {
  campaigns: ServiceRequest[]
  page: number
  limit: number
  totalItems: number
  loading: boolean
}

const initialState: CampaignsListState = {
  campaigns: [],
  page: 1,
  limit: 5,
  totalItems: 0,
  loading: false,
}

const campaignsListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setCampaigns: (state, action: PayloadAction<ServiceRequest[]>) => {
      state.campaigns = action.payload
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
  setCampaigns,
  setPageIndex,
  setPageSize,
  setTotalItems,
  setLoading,
} = campaignsListSlice.actions

export default campaignsListSlice.reducer
