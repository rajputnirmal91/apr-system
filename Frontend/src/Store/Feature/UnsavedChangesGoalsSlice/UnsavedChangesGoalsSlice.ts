import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GoalsUIState {
  hasUnsavedChanges: boolean;
}

const initialState: GoalsUIState = {
  hasUnsavedChanges: false,
};

const unsavedChangesGoalsSlice = createSlice({
  name: "unsavedChangesGoalsSlice",
  initialState,
  reducers: {
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
    resetUIState: () => initialState,
  },
});



export const { setUnsavedChanges, resetUIState } = unsavedChangesGoalsSlice.actions
export default unsavedChangesGoalsSlice

