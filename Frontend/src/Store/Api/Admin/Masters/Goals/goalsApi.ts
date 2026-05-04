/* eslint-disable no-console */
import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiResponse } from '@project/Types/apiResponse'
import {
  AddGoalMasterReq,
  checkDuplicateGoalRequest,
  checkDuplicateGoalResponse,
  DeleteGoalWeightageRequest,
  DeleteGoalWeightageResponse,
  DeleteRequest,
  DeleteResponse,
  GoalListRequest,
  GoalMapRequest,
  GoalMapResponse,
  GoalMasterWeightageRequest,
  GoalsResponse,
  GoalWeightageRequest,
  GoalWeightageResponse,
  lastGoalDeleteRequest,
  lastGoalDeleteResponse,
  UpdateGoalWeightageRequest,
  UpdateGoalWeightageResponse,
  UpdateRequest,
  UpdateResponse,
  UpdateWeightageRequest,
  UpdateWeightageResponse,
} from '@project/Types/MasterGoals'
import axiosBaseQuery from '../../../baseQuery'
import {
  applyWeightageUpdates,
  getCachedGoalListEntries,
  PatchResult,
} from './goalWeightageOptimisticUpdate'

export type AddGoalMasterRes = ApiResponse<unknown>

const GoalsApi = createApi({
  reducerPath: 'GoalsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['goalMaster'],
  endpoints: (builder) => ({
    goalList: builder.query<GoalsResponse, GoalListRequest>({
      query: (body) => ({
        url: '/admin/goal-master/get-all',
        method: 'POST',
        data: body,
      }),
      providesTags: ['goalMaster'],
      forceRefetch: () => true,
      keepUnusedDataFor: 0,
    }),
    addGoal: builder.mutation<AddGoalMasterRes, AddGoalMasterReq>({
      query: (body) => ({
        url: `admin/goal-master/add`,
        method: 'POST',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    upsertGoalMasterWeightage: builder.mutation<
      AddGoalMasterRes,
      GoalMasterWeightageRequest
    >({
      query: (body) => ({
        url: '/admin/goal-master/add',
        method: 'POST',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    updateGoal: builder.mutation<UpdateResponse, UpdateRequest>({
      query: (body) => ({
        url: '/admin/goal-master/update',
        method: 'PUT',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    deleteGoal: builder.mutation<DeleteResponse, DeleteRequest>({
      query: (body) => ({
        url: '/admin/goal-master/delete',
        method: 'DELETE',
        data: body,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    updateGoalWeight: builder.mutation<
      UpdateWeightageResponse,
      UpdateWeightageRequest
    >({
      query: (body) => ({
        url: '/admin/goal-master/manage-weightage',
        method: 'PUT',
        data: body,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    checkDuplicateGoal: builder.mutation<
      checkDuplicateGoalResponse,
      checkDuplicateGoalRequest
    >({
      query: ({ goal_name, goal_id }) => ({
        url: '/admin/goal-master/check-duplicate-goal',
        method: 'POST',
        data: { goal_name, goal_id },
      }),
    }),
    goalMapped: builder.query<GoalMapResponse, GoalMapRequest>({
      query: (data) => ({
        url: '/admin/goal-master/get-all/weightage-mapping',
        method: 'POST',
        data,
      }),
      keepUnusedDataFor: 0,
    }),
    addGoalWeightage: builder.mutation<
      GoalWeightageResponse,
      GoalWeightageRequest
    >({
      query: (data) => ({
        url: '/admin/goal-master/add/weightage-mapping',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    updateGoalWeightage: builder.mutation<
      UpdateGoalWeightageResponse,
      UpdateGoalWeightageRequest
    >({
      query: (data) => ({
        url: '/admin/goal-master/manage-weightage',
        method: 'PUT',
        data,
        showErrorMessage: true,
        showResultMessage: true,
      }),
      invalidatesTags: ['goalMaster'],
      async onQueryStarted(body, { dispatch, queryFulfilled, getState }) {
        const reducerState = (getState() as Record<string, unknown>)[GoalsApi.reducerPath] as
          | { queries?: Record<string, { originalArgs?: unknown } | undefined> }
          | undefined

        const entries = getCachedGoalListEntries(reducerState ?? {})
        const patchResults: PatchResult[] = []

        entries.forEach(({ endpointName, originalArgs }) => {
          const patch = dispatch(
            GoalsApi.util.updateQueryData(
              endpointName,
              originalArgs as GoalListRequest,
              (draft) => applyWeightageUpdates(draft, body.goals ?? [])
            )
          )
          patchResults.push(patch)
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
        }
      },
    }),
    deleteGoalWeightage: builder.mutation<
      DeleteGoalWeightageResponse,
      DeleteGoalWeightageRequest
    >({
      query: (data) => ({
        url: '/admin/goal-master/delete/weightage-mapping',
        method: 'DELETE',
        data,
      }),
      invalidatesTags: ['goalMaster'],
    }),
    goalMappedList: builder.query<GoalsResponse, GoalListRequest>({
      query: (body) => ({
        url: '/admin/goal-master/get-all-by-session',
        method: 'POST',
        data: body,
      }),
      providesTags: ['goalMaster'],
      keepUnusedDataFor: 0,
    }),
    deleteLastGoal: builder.mutation<
      lastGoalDeleteResponse,
      lastGoalDeleteRequest
    >({
      query: (body) => ({
        url: '/admin/goal-master/delete',
        method: 'DELETE',
        data: body,
      }),
      invalidatesTags: ['goalMaster'],
    }),
  }),
})

export const {
  useGoalListQuery,
  useLazyGoalListQuery,
  useAddGoalMutation,
  useUpsertGoalMasterWeightageMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useUpdateGoalWeightMutation,
  useCheckDuplicateGoalMutation,
  useGoalMappedQuery,
  useAddGoalWeightageMutation,
  useUpdateGoalWeightageMutation,
  useDeleteGoalWeightageMutation,
  useGoalMappedListQuery,
  useDeleteLastGoalMutation,
} = GoalsApi
export default GoalsApi
