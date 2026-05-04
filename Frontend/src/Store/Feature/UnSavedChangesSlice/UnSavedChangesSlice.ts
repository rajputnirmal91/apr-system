import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  hasUnsavedChanges: boolean
}

const initialState: UIState = {
  hasUnsavedChanges: false,
}

const UnSavedChangesSlice = createSlice({
  name: 'UnSavedChangesSlice',
  initialState,
  reducers: {
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload
    },
    resetUIState: () => initialState,
  },
})

export const { setUnsavedChanges, resetUIState } = UnSavedChangesSlice.actions
export default UnSavedChangesSlice
