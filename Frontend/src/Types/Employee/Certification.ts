export interface CertificationFormReq {
  id: null
  name_of_certificate: string
  subject_name: string
  topic_name: string
  certification_start_date: string
  certification_end_date: string
  remarks: string
  attachment_url: string
}

export interface CertificationFormRes {
  message: string
  detail: string
}

export interface CertificationListReq {
  search: string | null
  order_by: 'asc' | 'desc'
}

export interface GetCertificationsListRes {
  message: string
  total_count: number
  appraisal_session_id: string
  certifications: CertificationFormReq[]
}

export interface DeleteEmpCertificationReq {
  id: string
  is_deleted: boolean
}
