/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type GoalMasterSliceState = {
  appraisal_session_id: string
}

const initialState: GoalMasterSliceState = {
  appraisal_session_id: '',
}

const goalsAssociationSlice = createSlice({
  name: 'goalsAssociationSlice',
  initialState,
  reducers: {
    setAppraisalSessionId(state, action: PayloadAction<string>) {
      state.appraisal_session_id = action.payload
    },
  },
})

export const { setAppraisalSessionId } = goalsAssociationSlice.actions

export default goalsAssociationSlice
