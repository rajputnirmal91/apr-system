import { createApi } from '@reduxjs/toolkit/query/react'

import {
  ApiRes,
  PedpDetailsReq,
  PedpDetailsRes,
  PedpSavePayload,
} from '@project/Types/Employee/Pedp'

import axiosBaseQuery from '../../baseQuery'

const PedpDetailsApi = createApi({
  reducerPath: 'PedpDetailsApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['PEDP_DETAILS'],

  endpoints: (builder) => ({
    getPedpDetails: builder.query<PedpDetailsRes, PedpDetailsReq>({
      query: (body) => ({
        url: '/employee/get-pedp-form-details',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),

    getPedpRating: builder.query<[], unknown>({
      query: ({ rating_for }) => ({
        url: '/pedp-rating/get-all',
        method: 'GET',
        params: { rating_for },
      }),
      forceRefetch: () => true,
    }),

    PedpForm: builder.mutation<ApiRes, PedpSavePayload>({
      query: (body) => ({
        url: '/employee/add-pedp-form-ratings',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      invalidatesTags: ['PEDP_DETAILS'],
    }),
  }),
})

export const {
  useGetPedpDetailsQuery,
  usePedpFormMutation,
  useGetPedpRatingQuery,
} = PedpDetailsApi

export default PedpDetailsApi
