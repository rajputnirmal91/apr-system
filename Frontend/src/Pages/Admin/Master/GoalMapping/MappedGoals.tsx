import { useState } from 'react'

import { Col, Container, Modal, Row } from 'react-bootstrap'

import AddWhiteIcon from '@project/assets/images/AddIcon.png'
import crossIcon from '@project/assets/images/black-cross.svg'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import FilterIcon from '@project/assets/images/Filter.svg'
import searchDark from '@project/assets/images/searchDark.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import CustomModal from '@project/Components/Modal/Modal'
import TableHeading from '@project/Components/TableHeading/TableHeading'
import AddGoalForm from '@project/Pages/Admin/Master/GoalMapping/AddGoalForm'
import GoalsMapList from '@project/Pages/Admin/Master/GoalMapping/GoalsMapList'
import ManageWeight from '@project/Pages/Admin/Master/GoalMapping/ManageWeight'
import {
  useGoalListQuery,
  useUpdateGoalWeightageMutation,
} from '@project/Store/Api/Admin/Masters/Goals'
import useDebounce from '@project/Utils/debounce'

type Goal = {
  id: string | null
  goalId?: string
  goalName: string
  goalType: string
  goalWeight: number
  is_associated?: boolean
}

type EditData = {
  goal_id: string
  goalName: string
  goalType: string
  goalWeight: number
}

type MappedGoalResponse = {
  id: string
  goal_id: string
  goal_name: string
  goal_type: number
  goal_weightage: number
  is_associated: boolean
}

const DropdownOption = [
  {
    label: 'Custom goal',
    value: '0',
  },
  {
    label: 'Global goal',
    value: '1',
  },
  {
    label: 'All goal',
    value: '-1',
  },
]

function MappedGoals() {
  const [showGoalForm, setGoalForm] = useState<boolean>(false)
  const [refetch, setRefetch] = useState<boolean>(false)
  const [showWeightageModal, setShowWeightageModal] = useState<boolean>(false)
  const [pendingNewGoals, setPendingNewGoals] = useState<Goal[]>([])
  const [createdGoalIds, setCreatedGoalIds] = useState<string[]>([])
  const [appendedGoals, setAppendedGoals] = useState<MappedGoalResponse[]>([])
  const [editData, setEditData] = useState<EditData | undefined>(undefined)
  const [updateGoalWeightage, { isLoading: manageWeightageLoading }] =
    useUpdateGoalWeightageMutation()
  const { data: goalListData, refetch: refetchGoals } = useGoalListQuery({
    page: 1,
    limit: 10000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const [cancelPopup, setCancelPopup] = useState<boolean>(false)
  // const navigate = useNavigate()
  const [select, setSelect] = useState<string | number>('-1')

  const handleRefetch = async () => {
    setRefetch(true)
    await refetchGoals()
  }

  const normalizeGoalName = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, ' ')

  const getGoalKey = (goal: Goal) =>
    goal.goalId
      ? `id:${goal.goalId}`
      : `name:${normalizeGoalName(goal.goalName)}|type:${goal.goalType}`

  const mergeGoals = (base: Goal[], extra: Goal[]) => {
    const merged = new Map<string, Goal>()
    base.forEach((goal) => merged.set(getGoalKey(goal), goal))
    extra.forEach((goal) => merged.set(getGoalKey(goal), goal))
    return Array.from(merged.values())
  }

  const handleShowWeightage = (goals: Goal[]) => {
    setPendingNewGoals(goals)
    setCreatedGoalIds(
      goals
        .map((goal) => goal.goalId)
        .filter((goalId): goalId is string => typeof goalId === 'string')
    )
    setShowWeightageModal(true)
  }

  const handleAppendGoals = (goals: MappedGoalResponse[]) => {
    setAppendedGoals((prev) => {
      const existingIds = new Set(prev.map((g) => g.goal_id))
      const merged = [...prev]
      goals.forEach((goal) => {
        if (!existingIds.has(goal.goal_id)) {
          merged.push(goal)
        }
      })
      return merged
    })
  }

  const handleCancelPopupClose = () => {
    setCancelPopup(false)
  }

  const handleGoalFormClose = () => {
    setGoalForm(false)
    setEditData(undefined)
    handleCancelPopupClose()
  }

  const handleEditGoal = (goalData: EditData) => {
    setEditData(goalData)
    setGoalForm(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const rawExistingGoals = goalListData?.goals ?? []

  const existingGoals: Goal[] = rawExistingGoals.map((goal) => ({
    id: goal.goal_id ?? goal.id,
    goalId: goal.goal_id ?? goal.id,
    goalName: goal.goal_name,
    goalType: String(goal.goal_type),
    goalWeight: goal.goal_weightage ?? 0,
    is_associated: goal.is_associated,
  }))

  const appendedGoalList: Goal[] = appendedGoals.map((goal) => ({
    id: goal.id,
    goalId: goal.goal_id,
    goalName: goal.goal_name,
    goalType: String(goal.goal_type),
    goalWeight: goal.goal_weightage,
    is_associated: goal.is_associated,
  }))

  const combinedGoals = mergeGoals(existingGoals, appendedGoalList)
  const modalGoals = mergeGoals(combinedGoals, pendingNewGoals)

  const isDisabled = combinedGoals.length === 0

  return (
    <>
      <Modal
        show={showWeightageModal}
        onHide={() => setShowWeightageModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        size="lg"
        className="custom-modal"
      >
        <ManageWeight
          mode="manage"
          label={
            pendingNewGoals.length ? 'Manage gols weightage' : 'Edit weightage'
          }
          manageWeight={modalGoals}
          isSubmitting={manageWeightageLoading}
          onSubmit={(payload) => updateGoalWeightage(payload).unwrap()}
          createdGoalIds={createdGoalIds}
          onMappingSaved={handleAppendGoals}
          handleDataRefetch={handleRefetch}
          closeForm={() => {
            setShowWeightageModal(false)
            setPendingNewGoals([])
            setCreatedGoalIds([])
          }}
        />
      </Modal>
      <CustomModal
        show={cancelPopup}
        onClose={handleCancelPopupClose}
        onConfirm={handleGoalFormClose}
        image={CloseWhiteIcon}
        modalHeading="Cancel Goal’s"
        modalDesc="Are you sure you want to cancel the goal’s"
        type="Warning"
      />
      <AddGoalForm
        show={showGoalForm}
        closeForm={handleGoalFormClose}
        handleDataRefetch={handleRefetch}
        goalFormLabel={editData ? 'Edit goal' : 'Add new Goal'}
        editData={editData}
        handleGoalFormOpen={() => {
          setGoalForm(true)
        }}
        showWeightageModal={handleShowWeightage}
      />
      <Container fluid>
        <Row className="align-items-center mb-4 mt-3 mx-0">
          <Col lg={3} md={12} className="px-0">
            <TableHeading heading="Goals" />
          </Col>
          <Col lg={9} md={12} className="px-0">
            <Row className="gx-2 gy-2">
              <Col lg={3}>
                <div
                  style={{
                    pointerEvents: isDisabled ? 'none' : 'auto',
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <CustomDropdown
                    id="Select type"
                    options={DropdownOption}
                    placeholder="Select type"
                    append={document.body}
                    value={select}
                    onChange={(e: { target: { value: string | number } }) =>
                      setSelect(e.target.value)
                    }
                  />
                </div>
              </Col>
              <Col lg={3}>
                <CommonInput
                  className="common-input"
                  placeholder="Search"
                  width="100%"
                  disabled={isDisabled}
                  icon={
                    <img
                      src={search.length > 0 ? crossIcon : searchDark}
                      alt="searchLight"
                    />
                  }
                  value={search}
                  onChange={handleSearch}
                  iconClick={() => setSearch('')}
                />
              </Col>
              <Col lg={3}>
                <SharedButton
                  icon={FilterIcon}
                  label="Manage weightage"
                  variant="outline"
                  onClick={async () => {
                    await refetchGoals()
                    setShowWeightageModal(true)
                  }}
                  classname="weightageBtn"
                  disabled={isDisabled}
                />
              </Col>
              <Col lg={3}>
                <SharedButton
                  icon={AddWhiteIcon}
                  label="Add Goal"
                  onClick={() => {
                    setPendingNewGoals([])
                    setCreatedGoalIds([])
                    setEditData(undefined)
                    setGoalForm(true)
                  }}
                  style={{ width: '100%', height: '50px' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <GoalsMapList
        typeFilter={select}
        refetchData={refetch}
        search={debouncedSearch}
        showGoalForm={showGoalForm}
        appendGoals={appendedGoals}
        onEditGoal={handleEditGoal}
      />
    </>
  )
}

export default MappedGoals
