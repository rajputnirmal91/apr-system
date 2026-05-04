import { createApi } from '@reduxjs/toolkit/query/react'

import {
  AddNewRatingResponse,
  AddRatingRequestNew,
  checkDuplicateRatingRequest,
  checkDuplicateRatingResponse,
  DeleteRatingRequest,
  DeleteRatingResponse,
  GetRatingListRequest,
  GetRatingListRequestNew,
  GetRatingListResponse,
  RatingPointsRequest,
  RatingUpdateRequest,
  RatingUpdateResponse,
} from '@project/Types/rating'

import axiosBaseQuery from '../../baseQuery'

const ratingApi = createApi({
  reducerPath: 'ratingApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getRatingList: builder.query<GetRatingListResponse, GetRatingListRequest>({
      query: (body) => ({
        url: '/admin/rating-master/get-all',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),

    getRatingListNew: builder.query<
      GetRatingListResponse,
      GetRatingListRequestNew
    >({
      query: (body) => ({
        url: '/admin/rating-master/get-all',
        method: 'POST',
        data: body,
      }),
      forceRefetch: () => true,
    }),

    addNewRating: builder.mutation<AddNewRatingResponse, AddRatingRequestNew>({
      query: (body) => ({
        url: '/admin/rating-master/add-rating',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
    addRatingPoints: builder.mutation<
      AddNewRatingResponse,
      RatingPointsRequest
    >({
      query: (body) => ({
        url: 'admin/rating-master/add-rating-points',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
    }),
    getRatingById: builder.query({
      query: (ratingId: string) => ({
        url: `/admin/rating-master/get-rating?rating_id=${ratingId}`,
        method: 'GET',
      }),
    }),

    updateRatingListItem: builder.mutation<
      AddNewRatingResponse,
      AddRatingRequestNew
    >({
      query: (body) => ({
        url: '/admin/rating-master/update-rating',
        method: 'PUT',
        data: body,
        showErrorMessage: true,
      }),
    }),

    updateRatingPoints: builder.mutation<
      AddNewRatingResponse,
      RatingPointsRequest
    >({
      query: (body) => ({
        url: '/admin/rating-master/update-rating-points',
        method: 'PUT',
        data: body,
        showErrorMessage: true,
      }),
    }),

    updateRating: builder.mutation<RatingUpdateResponse, RatingUpdateRequest>({
      query: (body) => ({
        url: '/admin/rating-master/update',
        method: 'PUT',
        data: body,
        showErrorMessage: true,
      }),
    }),
    deleteRating: builder.mutation<DeleteRatingResponse, DeleteRatingRequest>({
      query: (body) => ({
        url: '/admin/rating-master/delete',
        method: 'DELETE',
        data: body,
      }),
    }),
    checkDuplicateRating: builder.mutation<
      checkDuplicateRatingResponse,
      checkDuplicateRatingRequest
    >({
      query: (body) => ({
        url: '/admin/rating-master/check-duplicate-rating-title',
        method: 'POST',
        data: body,
      }),
    }),
  }),
})

export const {
  useGetRatingListQuery,
  useAddNewRatingMutation,
  useAddRatingPointsMutation,
  useUpdateRatingPointsMutation,
  useUpdateRatingListItemMutation,
  useGetRatingByIdQuery,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useGetRatingListNewQuery,
  useCheckDuplicateRatingMutation,
} = ratingApi
export default ratingApi
