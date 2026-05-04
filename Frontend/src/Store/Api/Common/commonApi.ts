import { createApi } from '@reduxjs/toolkit/query/react'

import type { SessionItem } from '@project/Types/sessionTypes'

import axiosBaseQuery from '../baseQuery'

export type GetSessionsResponse = {
  appraisal_sessions: SessionItem[]
}

export type CreateSessionDataResponse = {
  status_code: number
  message: string
}

export type CreateSessionDataRequest = {
  copy_from_appraisal_session_id: string
  copy_ratings: boolean
  copy_goal_mappings: boolean
  copy_goal_associations: boolean
  copy_kra_master: boolean
}

export type DesignationResponse = {
  designation_id: string
  designation_title: string
}[]

export type RatingType = {
  id: string
  rating: string
  title: string
  is_remarks_mandatory: boolean
}

export type RolesResponse = {
  roles: string[]
}

const commonApi = createApi({
  reducerPath: 'commonApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Sessions'],
  endpoints: (builder) => ({
    getSessions: builder.query<GetSessionsResponse, void>({
      query: () => ({
        url: 'admin/common/get-sessions',
        method: 'GET',
      }),
      providesTags: ['Sessions'],
    }),
    createSessionData: builder.mutation<
      CreateSessionDataResponse,
      CreateSessionDataRequest
    >({
      query: (data) => ({
        url: 'admin/common/create-session-data',
        method: 'POST',
        data,
        showResultMessage: false,
      }),
    }),
    getDesignation: builder.query<DesignationResponse, void>({
      query: () => ({
        url: 'admin/common/get-designations',
        method: 'GET',
      }),
    }),
    getRating: builder.query<RatingType[], unknown>({
      query: ({ rating_for }) => ({
        url: '/pedp-rating/get-all',
        method: 'GET',
        params: { rating_for },
      }),
      keepUnusedDataFor: 0,
    }),
    getRoles: builder.query<RolesResponse, void>({
      query: () => ({
        url: 'admin/common/roles',
        method: 'GET',
      }),
      forceRefetch: () => true,
    }),
  }),
})

export const selectSessions = (state: any) =>
  commonApi.endpoints.getSessions.select()(state)?.data?.appraisal_sessions ||
  []

export const selectSessionLoaded = (state: any) =>
  commonApi.endpoints.getSessions.select()(state)?.status === 'fulfilled'

export const {
  useGetSessionsQuery,
  useCreateSessionDataMutation,
  useGetDesignationQuery,
  useGetRatingQuery,
  useGetRolesQuery,
} = commonApi
export default commonApi
