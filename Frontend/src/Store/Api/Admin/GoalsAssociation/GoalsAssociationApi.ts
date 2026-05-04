/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'

import {
  AddGoalAssociationReq,
  AddGoalAssociationRes,
  delteCustomGoalsReq,
  DesignationResponse,
  GetGoalsAssociationReq,
  GetGoalsAssociationRes,
  getKralistReq,
  GetKraListRequest,
  GetKraListResponse,
  GetOwnerMasterRes,
} from '@project/Types/goalsAssociationTypes'

import axiosBaseQuery from '../../baseQuery'

const GoalsAssociationApi = createApi({
  reducerPath: 'GoalsAssociationApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['GoalsAssociationApi'],
  endpoints: (builder) => ({
    getGoalsAssociationList: builder.query<
      GetGoalsAssociationRes,
      GetGoalsAssociationReq
    >({
      query: (body) => ({
        url: '/admin/goal-associates/get-all',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),

    getCustomEyeViewDetails: builder.query<
      GetGoalsAssociationRes,
      GetGoalsAssociationReq
    >({
      query: (body) => ({
        url: '/admin/goal-associates/get-single-custom-goal-association-detail',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),

    kraListNew: builder.query<any, getKralistReq>({
      query: (body) => ({
        url: '/admin/kra-master/get-all-for-goal-association',
        method: 'POST',
        data: body,
      }),
      keepUnusedDataFor: 0,
    }),

    getDesignationList: builder.query<DesignationResponse, void>({
      query: () => ({
        url: '/admin/common/get-designations-for-custom-goal-association',
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),

    // GoalsAssociationApi.ts

    getOwnerMasterList: builder.query<GetOwnerMasterRes, void>({
      query: () => ({
        url: '/admin/owner-master/get-all',
        method: 'GET',
      }),
      forceRefetch: () => true,
    }),

    getCustomGoalsTableList: builder.query<any, void>({
      query: () => ({
        url: '/admin/goal-associates/get-all-custom-goal-association-list',
        method: 'GET',
      }),
      forceRefetch: () => true,
    }),

    getKraList: builder.query<GetKraListResponse, GetKraListRequest>({
      query: (body) => ({
        url: '/admin/kra-master/get-all',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),

    addGoalAssociation: builder.mutation<
      AddGoalAssociationRes,
      AddGoalAssociationReq
    >({
      query: (body) => ({
        url: '/admin/goal-associates/add',
        method: 'POST',
        data: body,
      }),
    }),

    updateGoalAssociation: builder.mutation<
      AddGoalAssociationRes,
      AddGoalAssociationReq
    >({
      query: (body) => ({
        url: '/admin/goal-associates/update',
        method: 'POST',
        data: body,
      }),
    }),
    deleteCustomGoalsAssociaton: builder.mutation<any, delteCustomGoalsReq>({
      query: (body) => ({
        url: '/admin/goal-associates/delete',
        method: 'POST',
        data: body,
      }),
    }),
  }),
})

// Export hooks
export const {
  useGetGoalsAssociationListQuery,
  useLazyGetDesignationListQuery,
  useGetDesignationListQuery,
  useGetOwnerMasterListQuery,
  useAddGoalAssociationMutation,
  useUpdateGoalAssociationMutation,
  useGetKraListQuery,
  useKraListNewQuery,
  useGetCustomGoalsTableListQuery,
  useLazyGetGoalsAssociationListQuery,
  useLazyGetCustomEyeViewDetailsQuery,
  useDeleteCustomGoalsAssociatonMutation,
} = GoalsAssociationApi

export default GoalsAssociationApi
