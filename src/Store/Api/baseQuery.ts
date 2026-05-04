import { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import dayjs from 'dayjs'

import { setAccessToken } from '@project/Store/Feature/UserSlice'
import { ApiResponse } from '@project/Types/apiResponse'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'

import {
  getLocalStorage,
  POST,
  removeLocalStorage,
  setLocalStorage,
  SUCCESSSTATUS,
  UNAUTHORIZED_STATUS,
} from '../../Utils'
import { type RootState } from '../store'

// Type for API request parameters
export interface AxiosQueryArgs {
  url: string
  showResultMessage?: boolean
  showErrorMessage?: boolean
  method?: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  responseType?: 'blob'
}
type LoginUserType = {
  id: string
  user_role_id: number
  user_role: string
  email: string
  name: string
  access_token: string
  token_type: string
}
// Handle custom error response
type ModifiedAxiosError<T> = AxiosError<ApiResponse<T>>['response']

axios.defaults.baseURL = process.env.VITE_API_BASE_URL

axios.interceptors.request.use(
  (config) => {
    const initialHeader = config.headers['Content-Type']
    const configCopy = { ...config }
    const userAuthData = getLocalStorage<LoginUserType>('authData')
    if (userAuthData?.access_token) {
      configCopy.headers.Authorization = `Bearer ${userAuthData.access_token}`
    }
    configCopy.headers.Accept = '*/*'
    configCopy.headers['Content-Type'] = initialHeader || 'application/json'
    configCopy.headers['Access-Control-Expose-Headers'] =
      'X-Pagination-Current-Page, X-Pagination-Total-Count'

    const sessionId = getLocalStorage('appraiselSessionId')
    if (sessionId) {
      configCopy.headers['appraisal-session-id'] = sessionId
    }

    return configCopy
  },
  (error) => Promise.reject(error)
)

const handleErrorByStatus = <TResponse>(
  response: ModifiedAxiosError<TResponse>,
  api: BaseQueryApi,
  data: AxiosQueryArgs
) => {
  const responseData = response?.data
  if (response?.status === UNAUTHORIZED_STATUS) {
    const allState = api.getState() as RootState
    const { refreshToken, refreshTokenExpiryTime, accessToken } =
      allState.userSlice

    if (refreshToken && refreshTokenExpiryTime) {
      const refreshTime = dayjs(refreshTokenExpiryTime)
      const currentTime = dayjs(new Date())
      const timeDiff = refreshTime.diff(currentTime, 'second')

      if (timeDiff <= 0) {
        const apiData = {
          url: `${axios.defaults.baseURL}Auth/refresh`,
          method: POST,
          data: { refreshToken, accessToken },
        }
        axios(apiData).then((res) => {
          if (res.data.Data) {
            const newAuth = res.data.Data
            const currentUser = (api.getState() as RootState).userSlice
            // if role or user id changed during refresh, force logout
            if (
              currentUser.user_role &&
              newAuth.user_role &&
              currentUser.user_role !== newAuth.user_role
            ) {
              removeLocalStorage('authData')
              api.dispatch({ type: 'userSlice/logout' })
              showErrorToast(
                'Your role has changed on the server. Please login again.'
              )
            } else {
              setLocalStorage('authData', newAuth)
              // also update redux access token in case it changed
              api.dispatch(setAccessToken(newAuth.access_token))
            }
          }
        })
      }
      // else {
      //   api.dispatch({ type: 'reset' })
      //   clearLocalStorage()
      // }
    }

    // Clear local auth and mark that login page should show auth toast
    removeLocalStorage('authData')
    setLocalStorage('showNotAuthToast', true)
    // clear token from redux state so ProtectedRoute will redirect immediately
    api.dispatch(setAccessToken(''))
    // also reset entire user state to avoid lingering info
    api.dispatch({ type: 'userSlice/logout' })
  }

  if (
    responseData &&
    responseData?.status !== SUCCESSSTATUS &&
    data.showErrorMessage !== false &&
    response?.status !== UNAUTHORIZED_STATUS
  ) {
    showErrorToast(
      responseData?.detail || 'API FAILED, PLEASE CHECK NETWORK LOGS...'
    )
  }
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs, unknown, unknown> => async (data, api) => {
    try {
      const result = await axios({ ...data })

      if (data.responseType === 'blob') {
        const hiddenElement = document.createElement('a')
        const url = window.URL || window.webkitURL
        const blobPDF = url.createObjectURL(result.data)
        hiddenElement.href = blobPDF
        hiddenElement.target = '_blank'
        hiddenElement.download = `report.xlsx`
        hiddenElement.click()
      }

      if (data.showResultMessage) {
        if (result?.status === SUCCESSSTATUS) {
          showSuccessToast(result?.data?.message || 'Operation was successful.')
        } else if (result?.status === 204) {
          showSuccessToast('No content found.')
        }
      }

      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError<ApiResponse<unknown>>
      if (err?.response) {
        handleErrorByStatus(err.response, api, data)
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export default axiosBaseQuery
