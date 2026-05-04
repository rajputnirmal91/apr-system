import { createApi } from '@reduxjs/toolkit/query/react'

import {
  DateAddRequest,
  DateListRequest,
  IDateMutationResponse,
} from '@project/Types/DateTypes'

import axiosBaseQuery from '../../../baseQuery'

const DateApi = createApi({
  reducerPath: 'DateApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    dateList: builder.query<unknown, DateListRequest>({
      query: (body) => ({
        url: '/admin/pedp-form/get-all',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),
    dateAdd: builder.mutation<IDateMutationResponse, DateAddRequest>({
      query: (body) => ({
        url: '/admin/pedp-form/add',
        method: 'POST',
        data: body,
      }),
    }),
    dateEdit: builder.mutation<IDateMutationResponse, DateAddRequest>({
      query: (body) => ({
        url: '/admin/pedp-form/edit',
        method: 'PUT',
        data: body,
      }),
    }),
  }),
})

export const { useDateListQuery, useDateAddMutation, useDateEditMutation } =
  DateApi
export default DateApi
