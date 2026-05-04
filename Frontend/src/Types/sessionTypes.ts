export type SessionItem = {
  appraisal_session_id: string
  is_present_session: boolean
  session_end_date: string
  session_start_date: string
  session: string
  is_associated: boolean
  is_form_published: boolean
}

export type GetSessionsResponse = {
  appraisal_sessions: SessionItem[]
  total_count: number
}

export type GetSessionRequest = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
}

export type CreateSessionDataRequest = {
  copy_from_appraisal_session_id: string
  copy_ratings: boolean
  copy_goal_mappings: boolean
  copy_goal_associations: boolean
}

export type AddSessionRequest = {
  session: string
  is_present_session: boolean
  session_start_date: string
  session_end_date: string
}

export type AddSessionResponse = {
  message: string
}

export type UpdateSessionRequest = {
  appraisal_session_id: string
  session: string
  is_present_session: boolean
  session_start_date: string
  session_end_date: string
}

export type UpdateSessionResponse = {
  message: string
}
export type DeleteSessionRequest = {
  session_id: string
}
export type DeleteSessionResponse = {
  message: string
}

export type DesignationResponse = {
  designation_id: string
  designation_title: string
}[]

export type RatingType = {
  id: string
  rating: string
  is_remarks_mandatory: string
}

export type CheckDuplicateSessionResponse = {
  message: string
}

export type CheckDuplicateSessionNameRequest = {
  id?: string
  session_name: string
  appraisal_session_id: string | null
}
