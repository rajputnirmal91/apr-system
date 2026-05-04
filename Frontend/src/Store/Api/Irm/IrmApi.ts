/* eslint-disable */
import { createApi } from '@reduxjs/toolkit/query/react'

import axiosBaseQuery from '../baseQuery'
import {
  getirmDashboardListReq,
  irmCounter,
  addRatingReamarkPayloadReq,
  getIrmEmpDashboardlist,
} from '@project/Types/Irm/IrmTypes'

const IrmApi = createApi({
  reducerPath: 'IrmApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['IrmApi'],
  endpoints: (builder) => ({
    getIrmCounter: builder.query<irmCounter, void>({
      query: () => ({
        url: '/irm/get-counters',
        method: 'GET',
      }),
      forceRefetch() {
        return true
      },
    }),

    getIrmDashboardList: builder.query<
      getIrmEmpDashboardlist,
      getirmDashboardListReq
    >({
      query: (body) => ({
        url: '/irm/get-team-members',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getEmployeeDetails: builder.query<any, string>({
      query: (employee_user_id) => ({
        url: '/irm/get-team-member-pedp-details',
        method: 'GET',
        params: { employee_user_id: employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),

    addIrmRatingRemark: builder.mutation<unknown, addRatingReamarkPayloadReq>({
      query: (body) => ({
        url: '/irm/add-pedp-form-ratings',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),

    publishIrmRatingRemark: builder.mutation<
      unknown,
      addRatingReamarkPayloadReq
    >({
      query: (body) => ({
        url: '/irm/add-pedp-form-ratings',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
    getCertificateList: builder.query<any, string>({
      query: (employee_user_id) => ({
        url: '/irm/get-team-member-certifications',
        method: 'GET',
        params: { employee_user_id: employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
    getProjectDetailsList: builder.query<any, string>({
      query: (employee_user_id) => ({
        url: '/irm/get-team-member-project-details',
        method: 'GET',
        params: { employee_user_id: employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
})

export const {
  useGetIrmCounterQuery,
  useGetIrmDashboardListQuery,
  useGetEmployeeDetailsQuery,
  usePublishIrmRatingRemarkMutation,
  useAddIrmRatingRemarkMutation,
  useGetCertificateListQuery,
  useGetProjectDetailsListQuery,
} = IrmApi

export default IrmApi
