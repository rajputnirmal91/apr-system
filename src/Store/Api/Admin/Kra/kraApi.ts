import { createApi } from '@reduxjs/toolkit/query/react'

import {
  AddNewKraRequest,
  AddNewKraResponse,
  DeleteKraRequest,
  DeleteKraResponse,
  GetKraListRequest,
  GetKraListResponse,
  KraUpdateRequest,
  KraUpdateResponse,
} from '@project/Types/kraType'

import axiosBaseQuery from '../../baseQuery'

const KraApi = createApi({
  reducerPath: 'kraApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getKraList: builder.query<GetKraListResponse, GetKraListRequest>({
      query: (body) => ({
        url: '/admin/kra-master/get-all',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),
    addNewKra: builder.mutation<AddNewKraResponse, AddNewKraRequest>({
      query: (body) => ({
        url: '/admin/kra-master/add',
        method: 'POST',
        data: body,
        showResultMessage: true,
        showErrorMessage: true,
      }),
    }),
    updateKra: builder.mutation<KraUpdateResponse, KraUpdateRequest>({
      query: (body) => ({
        url: '/admin/kra-master/update',
        method: 'PUT',
        data: body,
        showResultMessage: true,
        showErrorMessage: true,
      }),
    }),
    deleteKra: builder.mutation<DeleteKraResponse, DeleteKraRequest>({
      query: (body) => ({
        url: '/admin/kra-master/delete',
        method: 'DELETE',
        data: body,
      }),
    }),
  }),
})

export const {
  useGetKraListQuery,
  useAddNewKraMutation,
  useUpdateKraMutation,
  useDeleteKraMutation,
} = KraApi
export default KraApi
