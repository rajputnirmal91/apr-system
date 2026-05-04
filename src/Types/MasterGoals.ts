export interface Goal {
  id: string
  name: string
  type: string
  weightage?: string
}

type AddGoalMasterReq = {
  goals: {
    id: null | string
    goal_name: string
    goal_type: number
  }[]
}

type GoalListRequest = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
  goal_type?: number | string
}

type GoalData = {
  id: null | string
  goal_name: string
  goal_type: number
}

interface GoalsResponse {
  message: string
  total_count: number
  page: number
  goals: {
    goal_id: string
    id?: string
    goal_name: string
    goal_type: number
    goal_weightage: number
    is_associated: boolean
  }[]
}

type UpdateRequest = {
  goals: {
    goal_id: string
    goal_name: string
    goal_type: number
    goal_weightage: number
  }[]
}

type UpdateGoal = {
  id: string
  goal_name: string
  goal_type: number
  goal_weightage: number
}

type UpdateResponse = {
  message: string
  goal: UpdateGoal
}

type DeleteRequest = {
  id: string
  modified_by?: string
  is_deleted: boolean
}

type DeleteResponse = {
  message: string
}

type UpdateWeightageRequest = {
  goal: {
    id: string | null
    goal_name: string
    goal_type: number
    goal_weightage: number
  }[]
}

type UpdateWeightageResponse = {
  message: string
}

type DuplicateGaolResponse = {
  message: string
}

type GoalMapRequest = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
}

type GoalMapResponse = {
  message: string
  total_count: number
  page: number
  goals: [
    {
      id: string
      goal_id: string
      goal_name: string
      goal_type: number
      goal_weightage: number
      is_associated: boolean
    },
  ]
}

type GoalWeightageRequest = {
  goals: {
    goal_id: string | null | undefined
    goal_name: string
    goal_type: number
    goal_weightage: number
    is_associated?: boolean
  }[]
}

type GoalMasterWeightageRequest = {
  goals: {
    goal_id: string | null
    goal_name: string
    goal_type: number
    goal_weightage: number
  }[]
}

type GoalWeightageResponse = {
  message: string
}

type UpdateGoalWeightageRequest = {
  goals: {
    goal_id: string | null | undefined
    goal_name: string
    goal_type: number
    goal_weightage: number
    is_associated?: boolean
  }[]
  delete_goal?:
    | {
        goal_id: string | undefined
      }
    | undefined
}

type UpdateGoalWeightageResponse = {
  message: string
}

type DeleteGoalWeightageRequest = {
  id: string | undefined
  goal_id: string | undefined
}

type DeleteGoalWeightageResponse = {
  message: string
}

type EditData = {
  goal_id: string
  goalName: string
  goalType: string
  goalWeight: number
}

type GoalList = {
  id: null | string
  goalId?: string
  goalName: string
  goalType: string
  goalWeight: number
}

type WeightList = {
  id: string | null
  goalId?: string | null
  goalName: string
  goalType: string
  goalWeight: number
  is_associated?: boolean
}

type GoalFormProps = {
  goalFormLabel?: string
  closeForm?: () => void
  handleDataRefetch?: () => void | Promise<any>
  show: boolean
  handleGoalFormOpen: (label: string) => void
  editData?: EditData
  showWeightageModal?: (goals: GoalList[]) => void
}

type checkDuplicateGoalRequest = {
  goal_name: string
  goal_id: string | null
}

type checkDuplicateGoalResponse = {
  message: string
}

type lastGoalDeleteResponse = {
  message: string
}

type lastGoalDeleteRequest = {
  goal_id: string | null
}

export type {
  AddGoalMasterReq,
  checkDuplicateGoalRequest,
  checkDuplicateGoalResponse,
  DeleteGoalWeightageRequest,
  DeleteGoalWeightageResponse,
  DeleteRequest,
  DeleteResponse,
  DuplicateGaolResponse,
  EditData,
  GoalData,
  GoalFormProps,
  GoalList,
  GoalListRequest,
  GoalMapRequest,
  GoalMapResponse,
  GoalMasterWeightageRequest,
  GoalsResponse,
  GoalWeightageRequest,
  GoalWeightageResponse,
  lastGoalDeleteRequest,
  lastGoalDeleteResponse,
  UpdateGoal,
  UpdateGoalWeightageRequest,
  UpdateGoalWeightageResponse,
  UpdateRequest,
  UpdateResponse,
  UpdateWeightageRequest,
  UpdateWeightageResponse,
  WeightList,
}
