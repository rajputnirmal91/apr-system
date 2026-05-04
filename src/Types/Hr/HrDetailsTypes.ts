export type OrderBy = 'asc' | 'desc'

export type HrDashboardCounterRes = {
  total_employee: number
  total_form_received: number
  total_form_remaining: number
  total_form_reviewed: number
}

export type getHrDashboardListReq = {
  page: number
  limit: number
  order_by: OrderBy
  search: string
  sort_by: string
  filter_by?: string
}

export type RatingType = {
  id: string
  rating: string
  title: string
  is_remarks_mandatory: boolean
}

export type getHrEmpDashboardListArrayRes = {
  message: string
  total_count: number
  page: number
  team_members: getHrEmpDashboardRes[]
}

export type getHrEmpDashboardRes = {
  employee_user_id: string
  employee_lms_id: string
  employee_name: string
  employee_designation: string
  employee_form_status: string
  hr_review_status: string
}
