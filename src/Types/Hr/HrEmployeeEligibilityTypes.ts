export type HrEmployeeEligibilityRequest = {
  page: number
  limit: number
  search: string
  order_by: 'asc' | 'desc'
  filter_by?: string
}

export type HrEmployeeEligibilityCounters = {
  total_employees: number
  eligible_employees: number
  not_eligible_employees: number
  unpublished_forms: number
}

export type HrEmployeeReport = {
  id: string
  user_id: string
  employee_id: string
  employee_name: string
  designation_name: string
  employee_eligibility: string
  reason: string
  form_status: string
  designation_id: string
  irm_id: string
  appraisal_session_id: string
  irm_name: string
}

export type HrEmployeeEligibilityResponse = {
  message: string
  counters: HrEmployeeEligibilityCounters
  total_count: number
  page: number
  reports: HrEmployeeReport[]
}

export type HrPublishPedpRequest = {
  pepd_eligible_employees: HrEmployeeReport[]
}

export type HrPublishPedpResponse = {
  message: string
}
