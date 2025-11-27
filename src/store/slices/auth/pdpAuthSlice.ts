import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PdpAuthState = {
  token: string | null
  expiresAt: number | null
}

const initialState: PdpAuthState = {
  token: null,
  expiresAt: null,
}

const pdpAuthSlice = createSlice({
  name: 'pdpAuth',
  initialState,
  reducers: {
    setPdpToken: (
      state,
      action: PayloadAction<{ token: string; ttlMs: number }>
    ) => {
      state.token = action.payload.token
      state.expiresAt = Date.now() + action.payload.ttlMs
    },
    clearPdpToken: (state) => {
      state.token = null
      state.expiresAt = null
    },
  },
})

export const { setPdpToken, clearPdpToken } = pdpAuthSlice.actions
export default pdpAuthSlice.reducer
