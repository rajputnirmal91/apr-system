import { createApi } from '@reduxjs/toolkit/query/react'

import {
  PedpRequest,
  PedpResponse,
  ProjectRequest,
  ProjectResponse,
  ReportListRequest,
  ReportListResponse,
  UpdateDeadlineRequest,
  UpdateDeadlineResponse,
} from '@project/Types/reports'

import axiosBaseQuery from '../../baseQuery'

const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getReportsList: builder.query<ReportListResponse, ReportListRequest>({
      query: (data) => ({
        url: '/admin/pedp-form/report',
        method: 'POST',
        data,
      }),
      forceRefetch: () => true,
    }),
    pedp: builder.mutation<PedpResponse, PedpRequest>({
      query: (data) => ({
        url: '/admin/employee/get-pedp-report',
        method: 'POST',
        data,
      }),
    }),
    project: builder.mutation<ProjectResponse, ProjectRequest>({
      query: (data) => ({
        url: '/admin/employee/get-pedp-project-report',
        method: 'POST',
        data,
      }),
    }),
    updateDeadlines: builder.mutation<
      UpdateDeadlineResponse,
      UpdateDeadlineRequest
    >({
      query: (data) => ({
        url: '/admin/employee/update-deadline',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useGetReportsListQuery,
  usePedpMutation,
  useProjectMutation,
  useUpdateDeadlinesMutation,
} = reportsApi
export default reportsApi
