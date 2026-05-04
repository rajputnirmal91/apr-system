export type HrGetEmployeesRequest = {
  page: number
  limit: number
  order_by: string
  search: string | null
  sort_by: string
  filter_by?: string
}

export type HrEmployee = {
  employee_user_id: string
  employee_lms_id: string
  employee_name: string
  employee_email: string
  employee_designation: string
}

export type HrGetEmployeesResponse = {
  message: string
  total_count: number
  page: number
  employees: HrEmployee[]
}

export type HrSendBulkEmailRequest = {
  id: string | null
  email_template_id: string
  save_as_draft: boolean
  recipient: string[]
}

export type HrSendBulkEmailResponse = {
  message: string
}

export type HrGetEmailLogsRequest = {
  save_as_draft: boolean
  page: number
  limit: number
  order_by: string
  search: string | null
  sort_by: string
}

export type HrEmailLog = {
  id: string
  email_template_id: string
  email_template: string
  recipient: string[]
  send_status: boolean
  save_as_draft: boolean
  send_by: string
}

export type HrGetEmailLogsResponse = {
  message: string
  total_count: number
  page: number
  email_logs: HrEmailLog[]
}

export type HrGetEmailLogByIdRequest = {
  id: string
}

export type HrGetEmailLogByIdResponse = HrEmailLog & {
  message?: string
  email_subject?: string
  email_body?: string
}
