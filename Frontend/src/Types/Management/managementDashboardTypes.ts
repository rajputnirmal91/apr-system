export type managementCounter = {
  total_employee: number
  total_form_received: number
  total_form_remaining: number
  total_form_reviewed: number
}

export type empListManagementReq = {
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
  employee_form_status: string
  management_review_status: string
}

export interface EmpListManagementResponse {
  message: string
  total_count: number
  page: number
  team_members: EmployeeReview[]
}
