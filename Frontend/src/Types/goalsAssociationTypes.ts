/* eslint-disable @typescript-eslint/no-explicit-any */
type GoalAssociation = {
  id: number
  goal_id: number
  appraisal_session_id: string
  goal_name: string
  goal_weightage: number
  owner_id: string | null
  owner_name: string
  designation_id: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kra: any[]
  status: string
  GoalAssociation: number
}

export type GetGoalsAssociationRes = {
  Goals: GoalAssociation[]
  is_form_published: boolean
}

export type GetGoalsAssociationReq = {
  goal_type: number
  search: string
  designation?: string
}

export interface Owner {
  id: number
  owner: string
}

export interface GetOwnerMasterRes {
  Owners: Owner[]
}

export interface AddSubKraPayload {
  id: string
  sub_kra_name: string
  sub_kra_weightage: number
}

export interface AddKraPayload {
  id: string
  kra_name: string
  kra_weightage: number
  sub_kra: AddSubKraPayload[]
}

export interface AddGoalAssociationReq {
  goal_id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any
  goal_name: string
  goal_weightage: number
  owner_id: number | null
  owner_name: string | null
  designation_id: string | null
  designation_name: string | null
  kra: AddKraPayload[]
  status: string
}

export type AddGoalAssociationRes = {
  message: string
  detail: string
}

export type GetKraListRequest = {
  page: number
  limit: number
  search?: string
  order_by?: 'asc' | 'desc'
  appraisal_session_id: string | null | undefined
}

export type GetKraListResponse = {
  message: string
  total_count: number
  page: number
  kras: [
    {
      id: string
      appraisal_session_id: string | null | undefined
      kra_name: string
      sub_kras: [
        {
          id: string
          kra_id: string
          sub_kra_name: string
        },
      ]
    },
  ]
}

// 🔹 Sub-KRA type
export interface SubKra {
  id: string
  sub_kra_name: string
  sub_kra_weightage: number
  kra_id: string
  // kra_name: string
}

// 🔹 KRA type
export interface Kra {
  id: string
  kra_name: string
  kra_weightage: number
  sub_kra: SubKra[]
}

// 🔹 Goal type
export interface AddGoalsRequest {
  id: null
  goal_id: string
  goal_name: string
  goal_weightage: number
  ownerId: number | null
  owner_name: string
  designation_id: string | null
  designation_name: string | null
  kra: Kra[]
  status: string
}

type Designation = {
  designation_id: string
  designation_title: string
}

export type DesignationResponse = {
  designations: Designation[]
}

// get kra list
export type getKralistReq = {
  goal_type: number
  designation_id: string
  goal_association_id: any
}

export type delteCustomGoalsReq = {
 id : string
 designation_id: string
}

export type CustomGoalsTableItem = {
  id: string
  designation_id: string
  designation: string
  goal_names: string[]
  kra_names: string[]
  sub_kra_names: string[]
  is_form_published: boolean
}

export type GetCustomGoalsTableListRes = {
  is_form_published: boolean
  data: CustomGoalsTableItem[]
}
