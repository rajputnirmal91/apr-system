import { createApi } from '@reduxjs/toolkit/query/react'

import {
  EmployeeEditResponse,
  EmployeeeEditRequest,
  EmployeeRequest,
  EmployeeResponse,
} from '@project/Types/employeeEligibility'

import axiosBaseQuery from '../../baseQuery'

const EmployeeEligibilityApi = createApi({
  reducerPath: 'EmployeeEligibilityApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getEmployeeListing: builder.query<EmployeeResponse, EmployeeRequest>({
      query: (data) => ({
        url: '/admin/pedp-form/employee-eligibility',
        method: 'POST',
        data,
      }),
      forceRefetch: () => true,
    }),
    editEmployeeEligibility: builder.mutation<
      EmployeeEditResponse,
      EmployeeeEditRequest
    >({
      query: (data) => ({
        url: '/admin/pedp-form/employee-eligibility/edit',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useGetEmployeeListingQuery,
  useEditEmployeeEligibilityMutation,
} = EmployeeEligibilityApi

export default EmployeeEligibilityApi
