import { createApi } from '@reduxjs/toolkit/query/react'

import {
  empListManagementReq,
  EmpListManagementResponse,
} from '@project/Types/Management/managementDashboardTypes'
import { addPedpProjectCommentReq } from '@project/Types/Management/managementPedpTypese'

import axiosBaseQuery from '../baseQuery'

const managementApi = createApi({
  reducerPath: 'managementApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['managementApi'],
  endpoints: (builder) => ({
    managementDashboardCounter: builder.query({
      query: (data) => ({
        url: '/management/get-counters',
        method: 'GET',
        data,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getManagementEmpList: builder.query<
      EmpListManagementResponse,
      empListManagementReq
    >({
      query: (data) => ({
        url: '/management/get-team-members',
        method: 'POST',
        data,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getEmployeeDetails: builder.query({
      query: (employeeUserId) => ({
        url: '/management/get-team-member-pedp-details',
        method: 'GET',
        params: { employee_user_id: employeeUserId },
      }),
      keepUnusedDataFor: 0,
    }),

    getManagementProjectDetailsList: builder.query({
      query: (employee_user_id) => ({
        url: '/management/get-team_member-project-details',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),

    getManagementEmpCertificateList: builder.query({
      query: (employee_user_id) => ({
        url: '/management/get-team-member-certifications',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),

    getReviewRating: builder.query({
      query: (employee_user_id) => ({
        url: '/management/get-rating-remarks',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),

    addProjectPedpComment: builder.mutation<unknown, addPedpProjectCommentReq>({
      query: (body) => ({
        url: '/management/add-pedp-form-comments',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
  }),
})

export const {
  useManagementDashboardCounterQuery,
  useGetManagementEmpListQuery,
  useGetEmployeeDetailsQuery,
  useGetManagementProjectDetailsListQuery,
  useGetManagementEmpCertificateListQuery,
  useGetReviewRatingQuery,
  useAddProjectPedpCommentMutation,
} = managementApi

export default managementApi
