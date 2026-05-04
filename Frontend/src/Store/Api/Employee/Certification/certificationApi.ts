import { createApi } from '@reduxjs/toolkit/query/react'

import {
  CertificationFormReq,
  CertificationFormRes,
  CertificationListReq,
  DeleteEmpCertificationReq,
  GetCertificationsListRes,
} from '@project/Types/Employee/Certification'

import axiosBaseQuery from '../../baseQuery'

const CertificationApi = createApi({
  reducerPath: 'certificationApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getCertificationList: builder.query<
      GetCertificationsListRes,
      CertificationListReq
    >({
      query: (body) => ({
        url: '/employee_certification/get',
        method: 'POST',
        data: body,
      }),
    }),

    addNewEmpCertification: builder.mutation<
      CertificationFormRes,
      CertificationFormReq
    >({
      query: (body) => ({
        url: '/employee_certification/add',
        method: 'POST',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    updateEmpCertification: builder.mutation<
      CertificationFormRes,
      CertificationFormReq
    >({
      query: (body) => ({
        url: 'employee_certification/update',
        method: 'PUT',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
    }),
    deleteEmpCertification: builder.mutation<
      CertificationFormRes,
      DeleteEmpCertificationReq
    >({
      query: (body) => ({
        url: '/employee_certification/delete',
        method: 'DELETE',
        data: body,
      }),
    }),
  }),
})

export const {
  useGetCertificationListQuery,
  useAddNewEmpCertificationMutation,
  useUpdateEmpCertificationMutation,
  useDeleteEmpCertificationMutation,
} = CertificationApi
export default CertificationApi
