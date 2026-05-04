// Sub-KRA Level
export type PedpSubKra = {
  goal_associates_sub_kra_id: string
  sub_kra_id: string
  sub_kra_name: string
  appraisee_rating: string | number | null
  appraisee_rating_id: string
  appraisee_remarks: string | null
  appraisers_rating_remarks?: {
    appraiser_name?: string | null
    appraiser_rating?: string | null
    appraiser_remarks?: string | null
  }[]
}

// KRA Level
export type PedpKra = {
  kra_id: string
  kra_name: string
  sub_kras: PedpSubKra[]
}

// Goals Level
export type PedpGoal = {
  goal_id: string
  goal_name: string
  kras: PedpKra[]
}

// Main Response Structure
export type PedpDetailsRes = {
  core_competency_appraise: string | null
  goals: PedpGoal[]
  core_competency_description_appraise: string | null
  form_status: string
  last_submission_date?: string | null
}

export type PedpDetailsReq = {
  employee_lms_id: string
  employee_user_id: string
}

// Add Rating pedp form
export type PedpformReq = {
  core_competency_appraise: string
  goals: PedpGoal[]
  core_competency_description_appraise: string
  form_status: 'Draft' | 'Submitted' | string
}

// // Add Rating pedp form

export type PedpSaveGoal = {
  goal_associates_sub_kra_id: string
  appraisee_rating_id: string | null
  appraisee_remarks: string | null
}

export type PedpPayloadReq = {
  core_competency_appraise: string
  core_competency_description_appraise: string
  form_status: 'Draft' | 'Submitted' | string
  goals: PedpSaveGoal[]
}

export type PedpSavePayload = {
  core_competency_appraise: string
  core_competency_description_appraise: string
  form_status: 'Draft' | 'Submitted' | string
  goals: PedpSaveGoal[]
}

export type ApiRes = {
  status: number
  data: {
    detail?: string
    message?: string
    [key: string]: unknown
  }
}
