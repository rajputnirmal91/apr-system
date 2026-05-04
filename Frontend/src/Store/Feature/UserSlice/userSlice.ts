/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@project/Store/store'
import { LoginResType } from '@project/Types/loginTypes'

type UserSliceState = {
  id: string
  email: string
  name: string
  user_role: string
  accessToken: string
  refreshToken: string
  refreshTokenExpiryTime: string
  lms_id: string
  profile_image_url: string | null
}

const initialState: UserSliceState = {
  id: '',
  email: '',
  name: '',
  user_role: '',
  accessToken: '',
  refreshToken: '',
  refreshTokenExpiryTime: '',
  lms_id: '',
  profile_image_url: null,
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserLoginData(state, action: PayloadAction<LoginResType>) {
      const {
        id,
        email,
        name,
        user_role,
        access_token,
        lms_id,
        profile_image_url,
      } = action.payload
      state.id = id
      state.email = email
      state.name = name
      state.user_role = user_role
      state.accessToken = access_token
      state.lms_id = lms_id
      state.profile_image_url = profile_image_url ?? null
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    logout: () => initialState,
  },
})

export const selectUserState = (state: RootState) => state.userSlice
export const { setUserLoginData, setAccessToken, logout } = userSlice.actions
// User Slice Selectors

export default userSlice
