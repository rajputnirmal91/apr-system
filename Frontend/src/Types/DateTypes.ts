export type DateListRequest = {
  page: number
  limit: number
  search: string | null
  order_by: 'asc' | 'desc'
}

export type DateAddRequest = {
  id: string | null
  submission_type: PublishSubmissionType
  submission_date: string
}

export type PublishSubmissionType =
  | 'PublishDate'
  | 'EmployeeDate'
  | 'HRDate'
  | 'IRMDate'
  | 'SRMDate'
  // | 'ManagerDate'
  | 'DirectorEngineerDate'
  | 'UnitHeadDate'
  | 'ManagementDate'

export interface IPublishItem {
  id: string | null
  submission_type: PublishSubmissionType
  submission_date: string | null
}

export interface IDateApiResponse {
  message: string
  total_count: number
  page: number
  PEDP_Form_Publish: IPublishItem[]
}

export interface ITableRow {
  id: number
  event: string
  date: string | null
  rawDate: string | null
  submission_type: PublishSubmissionType
  api_id: string | null
}

export interface IDateMutationResponse {
  message: string
  details?: string
}
