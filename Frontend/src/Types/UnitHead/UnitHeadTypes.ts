// for Dashborad counter
export type unitHeadDashboardCounterRes = {
  total_employee: number
  total_form_received: number
  total_form_remaining: number
  total_form_reviewed: number
}

// for emp list for dashboard Req and Res
export type empListDashboardReq = {
  page: number
  limit: number
  order_by: string
  search: string
  sort_by: string
}

export interface EmployeeReview {
  employee_user_id: string
  employee_lms_id: string
  employee_name: string
  employee_designation: string
  employee_form_status: 'Pending' | 'Reviewed'
  unit_head_review_status: 'Pending' | 'Reviewed'
}

export interface EmpListDashboardResponse {
  message: string
  total_count: number
  page: number
  team_members: EmployeeReview[]
}

export type empReviewAndRatingReq = {
  employee_user_id: string
  rating_by_unit_head: string
  remarks_by_unit_head: string
  form_status: string
}

export type getUnitHeadRatingAndRemarkRes = {
  rating_by_unit_head: string
  remarks_by_unit_head: string
  form_status: string
}

// Emp pedp form Response

export interface UnitHeadEmployeePedpForm {
  goals: Goal[]
  core_competency_appraisee: string
  core_competency_description_appraisee: string
  core_competency_description_appraiseer: string
}

export interface Goal {
  goal_id: string
  goal_name: string
  kras: KRA[]
}

export interface KRA {
  kra_id: string
  kra_name: string
  sub_kras: SubKRA[]
}

export interface SubKRA {
  goal_associates_sub_kra_id: string
  sub_kra_id: string
  sub_kra_name: string
  appraiser_rating: string
  appraiser_remark: string
  appraisee_rating: string
  appraisee_remarks: string
}

// for project tab response for employee
export type EmpProject = {
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
