import { createSlice } from '@reduxjs/toolkit'

export type ToolsAndServicesState = {
  loading: boolean
  toolsAndServicesList: any[]
  view: 'grid' | 'list'
}

export const SLICE_NAME = 'toolsAndServices'

const initialState: ToolsAndServicesState = {
  loading: false,
  toolsAndServicesList: [],
  view: 'grid',
}

const toolsAndServicesSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    toggleView: (state, action) => {
      state.view = action.payload
    },
  },
})

export const { toggleView } = toolsAndServicesSlice.actions
export default toolsAndServicesSlice.reducer
