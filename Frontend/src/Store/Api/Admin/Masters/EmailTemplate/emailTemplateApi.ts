/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiResponse } from '@project/Types/apiResponse'
import {
  AddEmailTemplateRequest,
  CheckDuplicateEmailTemplateRequest,
  CheckDuplicateEmailTemplateResponse,
  DeleteEmailTemplateRequest,
  DeleteEmailTemplateResponse,
  EmailTemplateListRequest,
  EmailTemplateResponse,
  UpdateEmailTemplateRequest,
} from '@project/Types/EmailTemplate'

import axiosBaseQuery from '../../../baseQuery'

export type AddEmailTemplateRes = ApiResponse<any>

const EmailTemplateApi = createApi({
  reducerPath: 'EmailTemplateApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['emailTemplateMaster'],
  endpoints: (builder) => ({
    emailTemplateList: builder.query<
      EmailTemplateResponse,
      EmailTemplateListRequest
    >({
      query: (body) => ({
        url: '/admin/email/get-email-template',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      forceRefetch: () => true,
    }),
    addEmailTemplate: builder.mutation<
      AddEmailTemplateRes,
      AddEmailTemplateRequest
    >({
      query: (body) => ({
        url: `/admin/email/add-email-template`,
        method: 'POST',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    updateEmailTemplate: builder.mutation<
      AddEmailTemplateRes,
      UpdateEmailTemplateRequest
    >({
      query: (body) => ({
        url: '/admin/email/update-email-template',
        method: 'POST',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    deleteEmailTemplate: builder.mutation<
      DeleteEmailTemplateResponse,
      DeleteEmailTemplateRequest
    >({
      query: ({ email_template_id }) => ({
        url: '/admin/email/delete-email-template',
        method: 'DELETE',
        params: { email_template_id },
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    checkDuplicateEmailTemplate: builder.mutation<
      CheckDuplicateEmailTemplateResponse,
      CheckDuplicateEmailTemplateRequest
    >({
      query: ({ template_name }) => ({
        url: '/admin/email/check-duplicate-email-template-name',
        method: 'POST',
        data: { template_name },
      }),
    }),
  }),
})
export const {
  useEmailTemplateListQuery,
  useAddEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useCheckDuplicateEmailTemplateMutation,
} = EmailTemplateApi
export default EmailTemplateApi
