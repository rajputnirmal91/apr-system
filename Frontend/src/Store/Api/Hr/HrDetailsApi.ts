/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'

import {
  getHrDashboardListReq,
  getHrEmpDashboardListArrayRes,
} from '@project/Types/Hr/HrDetailsTypes'

import axiosBaseQuery from '../baseQuery'

const HrDetailsApi = createApi({
  reducerPath: 'HrDetailsApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['HrDetailsApi'],

  endpoints: (builder) => ({
    getCounterList: builder.query({
      query: () => ({
        url: '/hr/get-counters',
        method: 'GET',
      }),
      forceRefetch: () => true,
    }),

    getHrDashboardList: builder.query<
      getHrEmpDashboardListArrayRes,
      getHrDashboardListReq
    >({
      query: (data) => ({
        url: '/hr/get-team-members',
        method: 'POST',
        data,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getEmployeePedpDetails: builder.query<any, string>({
      query: (employeeUserId) => ({
        url: '/hr/get-team-member-pedp-details',
        method: 'GET',
        params: { employee_user_id: employeeUserId },
      }),
      keepUnusedDataFor: 0,
    }),

    saveHrPedpForm: builder.mutation<unknown, any>({
      query: (body) => ({
        url: '/hr/add-pedp-form-ratings',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      invalidatesTags: ['HrDetailsApi'],
    }),
    publishHrPedpForm: builder.mutation<unknown, any>({
      query: (body) => ({
        url: '/hr/add-pedp-form-ratings',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      invalidatesTags: ['HrDetailsApi'],
    }),
  }),
})

export const {
  useGetCounterListQuery,
  useGetHrDashboardListQuery,
  useGetEmployeePedpDetailsQuery,
  useSaveHrPedpFormMutation,
  usePublishHrPedpFormMutation,
  useLazyGetEmployeePedpDetailsQuery,
} = HrDetailsApi

export default HrDetailsApi
