type ProjectListRequest = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
}

type Project = {
  sno: number
  project_id: string
  project_name: string
  client_name: string
  project_start_date: string
  project_end_date: string | null
  employee_strength: number
  review_status: string
}

type ProjectResponse = {
  message: string
  total_count: number
  page: number
  projects: Project[]
}

type ProjectDetailsRequest = {
  project_id: string
}

type ProjectDetailsResponse = {
  sno: number
  project_id: string
  project_name: string
  client_name: string
  project_start_date: string
  project_end_date: string | null
  employee_strength: number
  review_status: string
  received_appraisal_form: number
  reviewed_appraisal_form: number
}

type EmployeeListRequest = {
  project_id: string
}

type Employee = {
  pepd_form_id: string
  project_id: string
  user_id: string
  employee_id: string
  employee_name: string
  current_designation: string
  irm_name: string
  email_id: string
  mobile_number: string
  remarks_by_appraise: string | null
  rating_by_manager: number | null
  remarks_by_manager: string | null
  form_status: string
  start_date: string
}

type EmployeeListResponse = {
  employees: Employee[]
}

type SrmRemarksForEmployeeRequest = {
  pedp_form_id: string
  employee_user_id: string
  appraiser_remarks: string
  form_status: string
}

type EmployeeRatingResponse = {
  message: string
}

type PedpFormSummary = {
  total_project: number
  total_team_member: number
  total_form_received: number
  total_form_remaining: number
  total_form_reviewed: number
}

type TeamMember = {
  pepd_form_id: string
  project_id: string
  user_id: string
  employee_lms_id: string
  employee_name: string
  employee_designation: string
  irm_name: string
  email_id: string
  mobile_number: string
  remarks_by_appraise: string | null
  rating_by_manager: number | null
  remarks_by_manager: string | null
  employee_form_status: string
  hr_review_status: string
  employee_user_id: string
}

type TeamMemberListResponse = {
  total_count: number
  team_members: TeamMember[]
}

type TeamMemberListRequest = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
}

type teamMemberCdpDetailsResponse = {
  pedp_form_id: string
  employee_user_id: string
  core_competency_description_appraiser: string
  form_status: string
  employee_cdp: {
    strengths: string
    developmental_needs: string
    training_needs: string
  }
  appraiser_remarks: string | null
}

export type {
  EmployeeListRequest,
  EmployeeListResponse,
  EmployeeRatingResponse,
  PedpFormSummary,
  ProjectDetailsRequest,
  ProjectDetailsResponse,
  ProjectListRequest,
  ProjectResponse,
  SrmRemarksForEmployeeRequest,
  teamMemberCdpDetailsResponse,
  TeamMemberListRequest,
  TeamMemberListResponse,
}
