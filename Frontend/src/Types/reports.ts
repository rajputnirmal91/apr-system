/* eslint-disable */
type ReportListRequest = {
  page: number
  limit: number
  search: string
  order_by: string
}

type Employee = {
  id: string
  user_id: string
  employee_id: string
  employee_name: string
  appraisal_session_id: string
  employee_submission_deadline: string
  employee_status: string
  irm_submission_deadline: string
  irm_status: string
  srm_submission_deadline: string
  srm_status: string
  director_engineer_submission_deadline: string
  director_engineer_status: string
  unit_head_submission_deadline: string
  unit_head_status: string
  hr_submission_deadline: string
  hr_status: string
  management_submission_deadline: string
  management_status: string
  manager_submission_deadline: string
  manager_status: string
  pedp_form_submission_deadline: string
  pedp_form_status: string
  form_status: string
}

type ReportListResponse = {
  message: string
  total_count: number
  page: number
  reports: {
    id: string
    user_id: string
    employee_id: string
    employee_name: string
    appraisal_session_id: string
    employee_submission_deadline: string
    employee_status: string
    irm_submission_deadline: string
    irm_status: string
    srm_status: string
    director_engineer_status: string
    unit_head_submission_deadline: string
    unit_head_status: string
    hr_submission_deadline: string
    hr_status: string
    management_submission_deadline: string
    management_status: string
    manager_submission_deadline: string
    manager_status: string
    pedp_form_submission_deadline: string
    pedp_form_status: string
    form_status: string
  }[]
}

type PedpRequest = {
  employee_lms_id: string
  employee_user_id: string
}

type PedpResponse = {
  pedp: {
    pedp_deadline_details: {
      employee_submission_deadline: string
      employee_submission_status: string
      srm_submission_deadline: string
      srm_submission_status: string
      director_engineer_submission_deadline: string
      director_engineer_status: string
      irm_submission_deadline: string
      irm_submission_status: string
      unit_head_submission_deadline: string
      unit_head_submission_status: string
      hr_submission_deadline: string
      hr_submission_status: string
      management_submission_deadline: string
      management_submission_status: string
      pedp_form_publish_date: string
    }
    employee_details: {
      id: string
      user_id: string
      employee_id: string
      employee_name: string
      current_designation: string
      joining_date: string
      review_period: string
      total_it_experience: string
      total_lms_experience: string
      appraiser: string
    }
    ratings: string[]
    goals: {
      goal_id: string
      goal_name: string
      kras: {
        kra_id: string
        kra_name: string
        sub_kras: {
          sub_kra_id: string
          sub_kra_name: string
          appraiser_rating: string | null
          appraiser_remarks: string | null
          appraisee_rating: string | null
          appraisee_remarks: string | null
        }[]
        }[]
      }[]
    core_competency_appraisee: string
    core_competency_description_appraisee: string | null
  }
  project_details: any[]
  analytics_details: any | null
}

type ProjectRequest = {
  employee_lms_id: string
  employee_user_id: string
}

type ProjectDetails = {
  project_id: string
  project_name: string
  project_description: string | null
  project_start_date: string | null
  project_end_date: string | null
  project_status: string | null
  mode_of_handling: string | null
  remarks: string | null
}

type ProjectResponse = {
  pedp: any
  project_details: ProjectDetails[]
  analytics_details: any
}

type UpdateDeadlineRequest = {
  employee_user_id: string
  dates:
    | {
        PublishDate: string
        EmployeeDate: string
        IRMDate: string
        UnitHeadDate: string
        HRDate: string
        ManagementDate: string
        ManagerDate: string
      }
    | {
        PublishDate: string
        EmployeeDate: string
        IRMDate: string
        SRMDate: string
        DirectorEngineerDate: string
        UnitHeadDate: string
        HRDate: string
        ManagementDate: string
      }
}

type UpdateDeadlineResponse = {}

export type {
  ReportListRequest,
  ReportListResponse,
  Employee,
  PedpRequest,
  PedpResponse,
  ProjectRequest,
  ProjectResponse,
  UpdateDeadlineResponse,
  UpdateDeadlineRequest,
}
