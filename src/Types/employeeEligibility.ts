type EmployeeRequest = {
  page: number
  limit: number
  search: string
}

type counters = {
  eligible_employees: number
  not_eligible_employees: number
  unpublished_forms: number
  total_employees: number
}

type Reports = {
  id: string | undefined
  user_id: string | undefined
  appraisal_session_id: string
  employee_id: string | undefined
  employee_name: string
  employee_eligibility: string
  reason: string
  form_status: string
  designation_id:string
  designation_name:string
  irm_id:string
  irm_name:string
}

type EmployeeResponse = {
  message: string
  counters:counters
  total_count: number
  page: number
  reports: Reports[]
}

type EmployeeeEditRequest = {
  id: string | undefined
  user_id: string | undefined
  employee_id: string | undefined
  employee_eligibility: string
  reason: string
  form_status: string
}

type EmployeeEditResponse = {
  message: string
}

export type {
  EmployeeEditResponse,
  EmployeeeEditRequest,
  EmployeeRequest,
  EmployeeResponse,
  Reports,
}
