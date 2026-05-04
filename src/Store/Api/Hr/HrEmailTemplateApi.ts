import { createApi } from '@reduxjs/toolkit/query/react'

import {
  EmailTemplateListRequest,
  EmailTemplateResponse,
} from '@project/Types/EmailTemplate'
import {
  HrGetEmailLogByIdRequest,
  HrGetEmailLogByIdResponse,
  HrGetEmailLogsRequest,
  HrGetEmailLogsResponse,
  HrGetEmployeesRequest,
  HrGetEmployeesResponse,
  HrSendBulkEmailRequest,
  HrSendBulkEmailResponse,
} from '@project/Types/Hr/HrEmailTypes'

import axiosBaseQuery from '../baseQuery'

const HrEmailTemplateApi = createApi({
  reducerPath: 'HrEmailTemplateApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getHrEmailTemplates: builder.query<EmailTemplateResponse, EmailTemplateListRequest>({
      query: (body) => ({
        url: '/hr/get-email-template',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getHrEmployees: builder.query<HrGetEmployeesResponse, HrGetEmployeesRequest>({
      query: (body) => ({
        url: '/hr/get-all-employees',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    sendBulkEmail: builder.mutation<HrSendBulkEmailResponse, HrSendBulkEmailRequest>({
      query: (body) => ({
        url: '/hr/send-bulk-email',
        method: 'POST',
        data: body,
        showResultMessage: true,
        showErrorMessage: true,
      }),
    }),

    getEmailLogs: builder.query<HrGetEmailLogsResponse, HrGetEmailLogsRequest>({
      query: (body) => ({
        url: '/hr/get-email-logs',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),

    getEmailLogById: builder.query<HrGetEmailLogByIdResponse, HrGetEmailLogByIdRequest>({
      query: ({ id }) => ({
        url: `/hr/get-email-log-details?id=${id}`,
        method: 'GET',
        showErrorMessage: true,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
})

export const { useGetHrEmailTemplatesQuery, useGetHrEmployeesQuery, useSendBulkEmailMutation, useGetEmailLogsQuery, useGetEmailLogByIdQuery, useLazyGetEmailLogByIdQuery } = HrEmailTemplateApi
export default HrEmailTemplateApi
