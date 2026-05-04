export type reviewRatingSubKra = {
  goal_associates_sub_kra_id: string
  appraisee_rating?: string | null
  appraisee_remarks?: string | null
  appraiser_rating?: string | null
  appraiser_remarks?: string | null
  sub_kra_name?: string
}

export type reviewRatingKra = {
  kra_id: string
  kra_name: string
  sub_kras: reviewRatingSubKra[]
}

export type reviewRatingGoal = {
  goal_id: string
  goal_name: string
  goal_rating: string | null
  kras: reviewRatingKra[]
}

// add comment for goals PEDP
export type addPedpProjectCommentReq = {
  employee_user_id: string
  goal_associates_sub_kra_id: string
  comments: string
}
