export type irmCounter = {
  total_team_member: number
  total_project: number
  total_form_received: number
  total_form_remaining: number
  total_form_reviewed: number
}

export type getirmDashboardListReq = {
  page: number
  limit: number
  order_by?: string
  search?: string
  sort_by?: string
}

export type getIrmEmpDashboardlist = {
  message: string
  total_count: number
  page: number
  team_members: getirmDashboardListRes[]
}

export type getirmDashboardListRes = {
  srNo: number
  employee_user_id: string
  employee_lms_id: string
  employee_name: string
  employee_projects: string[]
  employee_form_status: string
  irm_review_status: string
}

export type GetHrDashboardListResponse = getirmDashboardListRes[]

// career development plan types
export type CdpFormDataReq = {
  employee_user_id: string
  pedp_form_id: string
  strength: string
  development_need: string
  training_need: string
  no_of_hours: string
}

// Career development plan update request
export type CdpFormUpdateReq = {
  employee_user_id: string
  pedp_form_id: string
  employee_cdp_id: string
  strength: string
  development_need: string
  training_need: string
  no_of_hours: string
}

// delete career development plan request
export type CdpFormDeleteReq = {
  employee_user_id: string
  pedp_form_id: string
  employee_cdp_id: string
}

// PEDP save payload
export type addRatingReamarkPayloadReq = {
  employee_user_id: string
  core_competency_description_appraiser?: string
  form_status?: string
  goals: {
    goal_associates_sub_kra_id: string
    appraiser_rating?: string
    appraiser_comments?: string
  }[]
}

// PEDP submit payload
export type PedpSubmitPayload = {
  employee_user_id: string
  form_status: string
}

// type for team members

export interface EmployeePedpResponse {
  employee_counters: EmployeeCounters
  employee_details: EmployeeDetails
  employee_pedp_form: EmployeePedpForm
  employee_career_development_plan: EmployeeCareerDevelopmentPlan[]
}

export interface EmployeeCounters {
  overall: string
  kra: string
  other: string
  cumulative: string
}

export interface EmployeeDetails {
  pedp_form_id: string
  employee_user_id: string
  employee_lms_id: string
  employee_name: string
  employee_current_designation: string
  date_of_joining: string // ISO string
  total_it_experience: string
  total_lms_experience: string
}

export interface EmployeePedpForm {
  goals: Goal[]
  core_competency_appraisee: string
  core_competency_description_appraisee: string
  core_competency_description_appraiser: string
  irm_form_status: 'Draft' | 'Submitted' | 'Reviewed' | 'Published'
}

export interface Goal {
  goal_id: string
  goal_name: string
  kras: Kra[]
}

export interface Kra {
  kra_id: string
  kra_name: string
  sub_kras: SubKra[]
}

export interface SubKra {
  goal_associates_sub_kra_id: string
  sub_kra_id: string
  sub_kra_name: string
  appraiser_rating: Rating
  appraiser_remarks: string
  appraisee_rating: Rating
  appraisee_remarks: string
}

export type Rating = 'S' | 'P' | 'N/A'

export interface EmployeeCareerDevelopmentPlan {
  employee_cdp_id: string
  strength: string
  development_need: string
  training_need: string
  no_of_hours: string
}

// project tab team memeber types

export interface EmployeeProjectsResponse {
  projects: Project[]
}

export interface Project {
  id: string
  project_id: string
  employee_status: string
  name_Of_Project: string
  client_name: string
  project_start_date: string
  project_end_date: string
  mode_of_project_handling: string
  role_in_project: string
  irm_name: string
  secondary_irm_name: string
  client_reporting_manager: string
  remarks: string
  rating_by_manager: string
  remarks_by_manager: string
  pedp_form_status: string
}

export type ProjectDetailsApiRes = {
  status: number
  data: {
    detail?: string
    message?: string
    [key: string]: unknown
  }
}

export type error = {
  detail?: string
}
