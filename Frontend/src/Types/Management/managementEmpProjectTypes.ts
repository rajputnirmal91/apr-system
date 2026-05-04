export type empProject = {
  project_id: string
  employee_status: string
  name_Of_Project: string
  client_name: string
  project_start_date: string
  mode_of_project_handling: string
  role_in_project: string
  irm_name: string
  secondary_irm_name: string
  client_reporting_manager: string
  project_end_date: string
  remarks: string
  rating_by_manager: string
  remarks_by_manager: string
  pedp_form_status: string
  comments: string
}

export type getProjectDetailsListRes = {
  projects: empProject[]
}
