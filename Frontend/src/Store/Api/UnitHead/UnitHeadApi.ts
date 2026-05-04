import { createApi } from '@reduxjs/toolkit/query/react'

import {
  empListDashboardReq,
  EmpListDashboardResponse,
  empReviewAndRatingReq,
  getUnitHeadRatingAndRemarkRes,
} from '@project/Types/UnitHead/UnitHeadTypes'

import axiosBaseQuery from '../baseQuery'

const UnitHeadApi = createApi({
  reducerPath: 'UnitHeadApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['UnitHeadApi'],
  endpoints: (builder) => ({
    getUnitheadDashboardCounter: builder.query({
      query: (data) => ({
        url: '/unit-head/get-counters',
        method: 'GET',
        data,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getUnitHeadDashboardEmpList: builder.query<
      EmpListDashboardResponse,
      empListDashboardReq
    >({
      query: (data) => ({
        url: '/unit-head/get-team-members',
        method: 'POST',
        data,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getEmployeeDetails: builder.query({
      query: (employeeUserId) => ({
        url: '/unit-head/get-team-member-pedp-details',
        method: 'GET',
        params: { employee_user_id: employeeUserId },
      }),
      keepUnusedDataFor: 0,
    }),

    getCertificateList: builder.query({
      query: (employee_user_id) => ({
        url: '/unit-head/get-team-member-certifications',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
    getProjectDetailsList: builder.query({
      query: (employee_user_id) => ({
        url: '/unit-head/get-team_member-project-details',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
    getUnitHeadRatingAndRemark: builder.query<
      getUnitHeadRatingAndRemarkRes,
      unknown
    >({
      query: (employee_user_id) => ({
        url: '/unit-head/get-rating-remarks?employee_user_id',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
    publishEmpReviewAndRating: builder.mutation<unknown, empReviewAndRatingReq>(
      {
        query: (body) => ({
          url: '/unit-head/add-pedp-form-ratings',
          method: 'POST',
          data: body,
          showErrorMessage: true,
        }),
      }
    ),
  }),
})

export const {
  useGetUnitheadDashboardCounterQuery,
  useGetUnitHeadDashboardEmpListQuery,
  useLazyGetEmployeeDetailsQuery,
  useGetEmployeeDetailsQuery,
  useGetProjectDetailsListQuery,
  useGetCertificateListQuery,
  useGetUnitHeadRatingAndRemarkQuery,
  usePublishEmpReviewAndRatingMutation,
} = UnitHeadApi

export default UnitHeadApi
