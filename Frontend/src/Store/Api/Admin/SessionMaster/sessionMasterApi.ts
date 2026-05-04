import { createApi } from '@reduxjs/toolkit/query/react'

import {
  AddSessionRequest,
  AddSessionResponse,
  CheckDuplicateSessionNameRequest,
  CheckDuplicateSessionResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
  GetSessionRequest,
  GetSessionsResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
} from '@project/Types/sessionTypes'

import axiosBaseQuery from '../../baseQuery'

const sessionMasterApi = createApi({
  reducerPath: 'SessionMasterApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['sessionMaster'],
  endpoints: (builder) => ({
    getSessionList: builder.query<GetSessionsResponse, GetSessionRequest>({
      query: (body) => ({
        url: '/admin/common/get-sessions-list',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      providesTags: ['sessionMaster'],
      // forceRefetch: () => true,
    }),
    addSession: builder.mutation<AddSessionResponse, AddSessionRequest>({
      query: (data) => ({
        url: 'admin/common/create-session',
        method: 'POST',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      invalidatesTags: ['sessionMaster'],
    }),
    updateSession: builder.mutation<
      UpdateSessionResponse,
      UpdateSessionRequest
    >({
      query: (data) => ({
        url: 'admin/common/update-session',
        method: 'PUT',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    deleteSession: builder.mutation<
      DeleteSessionResponse,
      DeleteSessionRequest
    >({
      query: ({ session_id }) => ({
        url: `admin/common/delete-session`,
        method: 'DELETE',
        params: { session_id },
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    checkDuplicateSessionName: builder.mutation<
      CheckDuplicateSessionResponse,
      CheckDuplicateSessionNameRequest
    >({
      query: ({ session_name, appraisal_session_id }) => ({
        url: '/admin/common/check-duplicate-session-name',
        method: 'POST',
        data: {
          session_name,
          appraisal_session_id,
        },
      }),
    }),
  }),
})

export const {
  useGetSessionListQuery,
  useAddSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useCheckDuplicateSessionNameMutation,
} = sessionMasterApi
export default sessionMasterApi
