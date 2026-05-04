import { createApi } from '@reduxjs/toolkit/query/react'

import {
  CdpFormDataReq,
  CdpFormDeleteReq,
  CdpFormUpdateReq,
} from '@project/Types/Irm/IrmTypes'
import {
  EmployeeListRequest,
  EmployeeListResponse,
  EmployeeRatingResponse,
  PedpFormSummary,
  ProjectDetailsRequest,
  ProjectDetailsResponse,
  ProjectListRequest,
  ProjectResponse,
  SrmRemarksForEmployeeRequest,
  teamMemberCdpDetailsResponse,
  TeamMemberListRequest,
  TeamMemberListResponse,
} from '@project/Types/manager'

import axiosBaseQuery from '../baseQuery'

const ManagerApi = createApi({
  reducerPath: 'ManagerApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getManagerCounter: builder.query<PedpFormSummary, void>({
      query: () => ({
        url: '/srm/get-counters',
        method: 'GET',
      }),
    }),
    getProjectList: builder.query<ProjectResponse, ProjectListRequest>({
      query: (data) => ({
        url: '/srm/get-project-list',
        method: 'POST',
        data,
      }),
    }),
    getProjectDetails: builder.query<
      ProjectDetailsResponse,
      ProjectDetailsRequest
    >({
      query: (data) => ({
        url: '/srm/get-project-detail',
        method: 'POST',
        data,
      }),
    }),
    getEmployeeList: builder.query<EmployeeListResponse, EmployeeListRequest>({
      query: (data) => ({
        url: '/srm/get-employees-by-project',
        method: 'POST',
        data,
      }),
    }),
    addEmployeeRating: builder.mutation<
      EmployeeRatingResponse,
      SrmRemarksForEmployeeRequest
    >({
      query: (data) => ({
        url: '/srm/add-rating-remarks',
        method: 'POST',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    getTeamMemberList: builder.query<
      TeamMemberListResponse,
      TeamMemberListRequest
    >({
      query: (data) => ({
        url: '/srm/get-team-members',
        method: 'POST',
        data,
      }),
    }),
    getProjectDetailsList: builder.query<any, string>({
      query: (employee_user_id) => ({
        url: '/admin/employee/projects-details',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
    getCertificateList: builder.query<any, string>({
      query: (employee_user_id) => ({
        url: '/admin/employee/certifications',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),

    getEmployeeDetails: builder.query<any, string>({
      query: (employee_user_id) => ({
        url: '/admin/employee/pedp-report',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
    addCdpForm: builder.mutation<unknown, CdpFormDataReq>({
      query: (body) => ({
        url: '/srm/add-career-development-plan',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
    updateCdpForm: builder.mutation<unknown, CdpFormUpdateReq>({
      query: (body) => ({
        url: '/srm/update-career-development-plan',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
    deleteCdp: builder.mutation<unknown, CdpFormDeleteReq>({
      query: (body) => ({
        url: '/srm/delete-career-development-plan',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
    getTeamMemberCdpDetails: builder.query<
      teamMemberCdpDetailsResponse,
      string
    >({
      query: (employee_user_id) => ({
        url: '/srm/get-team-member-cdp-with-other-details',
        method: 'GET',
        params: { employee_user_id },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
})

export const {
  useGetManagerCounterQuery,
  useGetProjectListQuery,
  useGetProjectDetailsQuery,
  useGetEmployeeListQuery,
  useAddEmployeeRatingMutation,
  useGetProjectDetailsListQuery,
  useGetCertificateListQuery,
  useGetTeamMemberListQuery,
  useGetEmployeeDetailsQuery,
  useAddCdpFormMutation,
  useUpdateCdpFormMutation,
  useDeleteCdpMutation,
  useGetTeamMemberCdpDetailsQuery,
} = ManagerApi
export default ManagerApi
