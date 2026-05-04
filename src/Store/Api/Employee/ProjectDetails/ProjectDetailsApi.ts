import { createApi } from '@reduxjs/toolkit/query/react'

import {
  ProjectDetailsApiRes,
  ProjectsDetailsReq,
  ProjectsDetailsResponse,
} from '@project/Types/Employee/ProjectDetails'

import axiosBaseQuery from '../../baseQuery'

const ProjectDetailsApi = createApi({
  reducerPath: 'ProjectDetailsApi',
  baseQuery: axiosBaseQuery(),

  tagTypes: ['Project_Details'],

  endpoints: (builder) => ({
    getProjectDetailsList: builder.query<ProjectsDetailsResponse, unknown>({
      query: () => ({
        url: '/employee-project/get-project-details',
        method: 'GET',
      }),
      forceRefetch: () => true,
    }),

    UpdateProjectDetails: builder.mutation<
      ProjectDetailsApiRes,
      ProjectsDetailsReq
    >({
      query: (body) => ({
        url: '/employee-project/update-project-remarks',
        method: 'POST',
        data: body,
        showErrorMessage: true,
      }),
      invalidatesTags: ['Project_Details'],
    }),
  }),
})

export const {
  useUpdateProjectDetailsMutation,
  useGetProjectDetailsListQuery,
} = ProjectDetailsApi

export default ProjectDetailsApi
