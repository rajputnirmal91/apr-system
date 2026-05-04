/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiResponse } from '@project/Types/apiResponse'

import type { LoginResType, LoginType } from '../../../Types/loginTypes'
import { setLocalStorage } from '../../../Utils'
import axiosBaseQuery from '../baseQuery'

const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['profileDetails'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResType, LoginType>({
      query: (request) => ({
        url: `auth/login`,
        method: 'POST',
        data: request,
        showErrorMessage: true,
        showResultMessage: false,
      }),
      async onQueryStarted(_arg, api) {
        try {
          const { data } = await api.queryFulfilled
          if (data) setLocalStorage('authData', data)
        } catch (error) {
          console.error('API ERROR', error)
        }
      },
    }),

    forgotPassword: builder.mutation<ApiResponse<any>, { email: string }>({
      query: (request) => ({
        url: `auth/forgot-password`,
        method: 'POST',
        data: request,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),

    resetPassword: builder.mutation<
      ApiResponse<any>,
      { token: string; new_password: string }
    >({
      query: (request) => ({
        url: 'auth/reset-password',
        method: 'POST',
        data: request,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),

    generateToken: builder.mutation<
      LoginResType,
      { email: string; selected_role: string }
    >({
      query: (request) => ({
        url: 'auth/generate-token',
        method: 'POST',
        data: request,
        showErrorMessage: true,
        showResultMessage: false,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGenerateTokenMutation,
} = loginApi
export default loginApi
