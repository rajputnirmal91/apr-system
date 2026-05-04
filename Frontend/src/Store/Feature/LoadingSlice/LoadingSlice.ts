import { createSlice } from '@reduxjs/toolkit'

export interface LoadingState {
  activeRequests: number
}

const initialState: LoadingState = {
  activeRequests: 0,
}

const loadingSlice = createSlice({
  name: 'loadingSlice',
  initialState,
  reducers: {
    incrementLoading: (state) => {
      state.activeRequests += 1
    },
    decrementLoading: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1)
    },
  },
})

export const { incrementLoading, decrementLoading } = loadingSlice.actions
export default loadingSlice
