import { createApi } from '@reduxjs/toolkit/query/react'

import axiosBaseQuery from '../../baseQuery'
import {
  RoleMasterAddRequest,
  RoleMasterAddResponse,
  RoleMasterListRequest,
  RoleMasterListResponse,
    RoleMasterUpdateRequest,
    RoleMasterUpdateResponse,
} from '@project/Types/AccessPermissionType'

const AccessPermissionApi = createApi({
    reducerPath: 'accessPermissionApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['roleMaster'],
    endpoints: (builder) => ({
        getRoleMasterList: builder.query<RoleMasterListResponse, RoleMasterListRequest>({
            query: (body) => ({
                url: '/admin/role-master/get-all',
                method: 'POST',
                data: body,
            }),
            providesTags: ['roleMaster'],
            forceRefetch: () => true,
        }),
        addRoleMaster: builder.mutation<RoleMasterAddResponse, RoleMasterAddRequest>({
            query: (body) => ({
                url: '/admin/role-master/add',
                method: 'POST',
                data: body,
                showErrorMessage: true,
                showResultMessage: true,
            }),
            invalidatesTags: ['roleMaster'],
        }),
        updateRoleMaster: builder.mutation<RoleMasterUpdateResponse, RoleMasterUpdateRequest>({
            query: (body) => ({
                url: '/admin/role-master/update',
                method: 'POST',
                data: body,
                showErrorMessage: true,
                showResultMessage: true,
            }),
            invalidatesTags: ['roleMaster'],
        }),
    }),
})

export const {
  useGetRoleMasterListQuery,
  useAddRoleMasterMutation,
  useUpdateRoleMasterMutation,
} = AccessPermissionApi
export default AccessPermissionApi;