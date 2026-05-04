export interface Certification {
  id: string
  name_of_certificate: string
  subject_name: string
  topic_name: string
  attachment_url: string
  remarks: string
  certification_start_date: string
  certification_end_date: string
}

export interface GetTeamCertificationsResponse {
  message: string
  total_count: number
  appraisal_session_id: string
  certifications: Certification[]
}
