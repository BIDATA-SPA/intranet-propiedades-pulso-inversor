// src/views/my-properties/store/propertyListSlice.ts
import { ServiceRequest } from '@/services/marketing/brand/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'brandsList'

export interface BrandsListState {
  brands: ServiceRequest[]
  page: number
  limit: number
  totalItems: number
  loading: boolean
}

const initialState: BrandsListState = {
  brands: [],
  page: 1,
  limit: 5,
  totalItems: 0,
  loading: false,
}

const brandsListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setBrands: (state, action: PayloadAction<ServiceRequest[]>) => {
      state.brands = action.payload
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
  setBrands,
  setPageIndex,
  setPageSize,
  setTotalItems,
  setLoading,
} = brandsListSlice.actions

export default brandsListSlice.reducer
