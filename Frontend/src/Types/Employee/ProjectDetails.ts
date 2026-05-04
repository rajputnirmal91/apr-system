type Project = {
  project_id: string
  remarks: string
  mode_of_project_handling: string
  role_in_project: string
}

export type ProjectsDetailsReq = {
  projects: Project[]
}

export type ProjectDetails = {
  project_id: string
  employee_status: string
  name_Of_Project: string
  client_name: string
  project_start_date: string // ISO date string
  mode_of_project_handling: string | null
  role_in_project: string | null
  irm_name: string
  secondary_irm_name: string | null
  client_reporting_manager: string | null
  project_end_date: string | null
  remarks: string | null
  pedp_form_status: string
}

export type ProjectsDetailsResponse = {
  projects: ProjectDetails[]
}

export type ProjectDetailsApiRes = {
  status: number
  data: {
    detail?: string
    message?: string
    [key: string]: unknown
  }
}
