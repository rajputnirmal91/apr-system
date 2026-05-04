/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Goal {
  id: string
  name: string
  type: string
  weightage?: string
}
type GoalMasterSliceState = {
  appraisal_session_id: string
  goals: Goal[]
  created_by: string
}

const initialState: GoalMasterSliceState = {
  appraisal_session_id: '',
  goals: [],
  created_by: '',
}

const goalMasterSlice = createSlice({
  name: 'goalMasterSlice',
  initialState,
  reducers: {
    setAppraisalSessionId(state, action: PayloadAction<string>) {
      state.appraisal_session_id = action.payload
    },
    addGoal(state, action: PayloadAction<Goal>) {
      state.goals.push(action.payload)
    },
    updateGoal(state, action: PayloadAction<Goal>) {
      const index = state.goals.findIndex((g) => g.id === action.payload.id)
      if (index >= 0) {
        state.goals[index] = action.payload
      }
    },
    removeGoal(state, action: PayloadAction<string>) {
      state.goals = state.goals.filter((g) => g.id !== action.payload)
    },
    setCreatedBy(state, action: PayloadAction<string>) {
      state.created_by = action.payload
    },
    resetGoalMaster(state) {
      state.appraisal_session_id = ''
      state.goals = []
      state.created_by = ''
    },
  },
})

export const {
  setAppraisalSessionId,
  addGoal,
  updateGoal,
  removeGoal,
  setCreatedBy,
  resetGoalMaster,
} = goalMasterSlice.actions

export default goalMasterSlice
