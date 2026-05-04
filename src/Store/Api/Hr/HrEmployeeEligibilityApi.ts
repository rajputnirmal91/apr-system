import { createApi } from '@reduxjs/toolkit/query/react'

import {
  HrEmployeeEligibilityRequest,
  HrEmployeeEligibilityResponse,
  HrPublishPedpRequest,
  HrPublishPedpResponse,
} from '@project/Types/Hr/HrEmployeeEligibilityTypes'

import axiosBaseQuery from '../baseQuery'

const HrEmployeeEligibilityApi = createApi({
  reducerPath: 'HrEmployeeEligibilityApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['HrEmployeeEligibility'],
  endpoints: (builder) => ({
    getHrEmployeeEligibilityList: builder.query<
      HrEmployeeEligibilityResponse,
      HrEmployeeEligibilityRequest
    >({
      query: (data) => ({
        url: '/hr/pedp-form/employee-eligibility',
        method: 'POST',
        data,
        showErrorMessage: true,
      }),
      providesTags: ['HrEmployeeEligibility'],
      keepUnusedDataFor: 0,
    }),
    publishPedp: builder.mutation<HrPublishPedpResponse, HrPublishPedpRequest>({
      query: (data) => ({
        url: '/hr/pedp-form/publish-pedp',
        method: 'POST',
        data,
        showResultMessage: true,
        showErrorMessage: true,
      }),
      invalidatesTags: ['HrEmployeeEligibility'],
    }),
  }),
})

export const { useGetHrEmployeeEligibilityListQuery, usePublishPedpMutation } =
  HrEmployeeEligibilityApi

export default HrEmployeeEligibilityApi
