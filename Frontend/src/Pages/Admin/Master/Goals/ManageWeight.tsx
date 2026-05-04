import { useEffect, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import {
  useAddGoalMutation,
  useGoalListQuery,
  useUpdateGoalWeightMutation,
} from '@project/Store/Api/Admin/Masters/Goals'

type WeightList = {
  id: string | null
  goalName: string
  goalType: string
  goalWeight: number
  is_associated?: boolean
}

type ManageWeightProps = {
  label: string
  manageWeight: WeightList[]
  handleDataRefetch?: () => void
  closeForm?: () => void
  deleteId?: string
  addGoalModalClose?: () => void
}

function ManageWeight({
  label,
  manageWeight,
  handleDataRefetch,
  closeForm,
  deleteId,
  addGoalModalClose,
}: ManageWeightProps) {
  const [weight, setWeight] = useState<WeightList[]>([])
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [createGoal, { isLoading: createGoalLoading }] = useAddGoalMutation()
  const [updateGoal, { isLoading: updateGoalLoading }] =
    useUpdateGoalWeightMutation()
  const { data } = useGoalListQuery({
    page: 1,
    limit: 1000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })

  useEffect(() => {
    if (label === 'Manage gols weightage') {
      setWeight(manageWeight)
    }
  }, [manageWeight, label])

  useEffect(() => {
    if (label === 'Edit weightage' && data?.goals) {
      const convertedArray = data?.goals.map((item) => ({
        id: item.id ?? null,
        goalName: item.goal_name,
        goalType: String(item.goal_type),
        goalWeight: item.goal_weightage,
      }))
      if (convertedArray) {
        setWeight(convertedArray)
      }
    }
  }, [data, label])

  useEffect(() => {
    if (label === 'Update weightage' && data?.goals) {
      const convertedArray = data.goals
        .filter((item) => item.id !== deleteId)
        .map((item) => ({
          id: item.id ?? null,
          goalName: item.goal_name,
          goalType: String(item.goal_type),
          goalWeight: item.goal_weightage,
        }))
      setWeight(convertedArray)
    }
  }, [data, label, deleteId])

  useEffect(() => {
    const allWeightsFilled = weight.every((goal) => goal.goalWeight > 0)
    const totalWeight = weight.reduce((sum, goal) => sum + goal.goalWeight, 0)
    setIsSaveDisabled(!(allWeightsFilled && totalWeight === 100))
  }, [weight])

  const handleGoalWeight = (index: number, value: string) => {
    const updatedList = [...weight]
    updatedList[index].goalWeight = Number(value) || 0
    setWeight(updatedList)
  }

  const handlePublish = () => {
    const updatedGoalList = manageWeight.map((goal) => ({
      id: goal?.id || null,
      goal_name: goal.goalName,
      goal_type: Number(goal.goalType),
      goal_weightage: Number(goal.goalWeight),
    }))

    const formData = {
      goals: updatedGoalList,
    }

    createGoal(formData)
      .unwrap()
      .then(() => {
        if (handleDataRefetch) handleDataRefetch()
        if (closeForm) closeForm()
        if (addGoalModalClose) addGoalModalClose()
      })
  }

  const handleUpdate = () => {
    const updatedGoalList = weight.map((goal) => ({
      id: goal?.id || null,
      goal_name: goal.goalName,
      goal_type: Number(goal.goalType),
      goal_weightage: Number(goal.goalWeight),
    }))

    const deleteGoal = {
      id: deleteId,
      is_deleted: true,
    }

    const formData = {
      goal: updatedGoalList,
      // delete_goal: deleteGoal
      ...(deleteId && {
        delete_goal: deleteGoal,
      }),
    }

    updateGoal(formData)
      .unwrap()
      .then(() => {
        if (handleDataRefetch) handleDataRefetch()
        if (closeForm) closeForm()
      })
  }

  return (
    <>
      <Row
        className="addNewGoalMain mx-0"
        style={{ backgroundColor: '#fffff' }}
      >
        <Col lg={12} className="addNewGoalHead">
          <div>
            <h3 className="font20 font400 fontOnest">{label}</h3>
          </div>
        </Col>
      </Row>

      <div className="userTableMain commonTable p-4">
        <TableResponsive maxHeight="50vh">
          <table className="table manageWeightageTable">
            <thead className="custom-thead">
              <tr className="custom-thead-row">
                <th scope="col" className="custom-th font14 font400">
                  <div className="d-flex align-items-center gap-2 ">
                    <span className="onest-regular-14">Goal Name</span>
                  </div>
                </th>
                <th scope="col" className="custom-th font14 font400">
                  <div className="d-flex align-items-center gap-2">
                    <span className="onest-regular-14">Goal weightage</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {weight.map((goal, index) => (
                <tr className="custom-row">
                  <td className="manageWeightage font16 font400">
                    <p className="mb-0 font16 font400 fontOnest textDark text">
                      {goal.goalName}
                    </p>
                  </td>
                  <td className="manageWeightage">
                    <CommonInput
                      placeholder="Please enter goal weightage"
                      width="100%"
                      height="40px"
                      value={goal.goalWeight.toString()}
                      onChange={(e) => handleGoalWeight(index, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableResponsive>
      </div>

      {/* <Row className={`mx-0 ${manageWeight.length > 6 ? 'goalList' : ''}`}>
        {weight.map((goal, index) => (
          <>
            <Col lg={8} className="my-3 goalNameLabel">
              <CommonInput
                label="Goal Name"
                placeholder="Please enter goal name"
                width="100%"
                value={goal.goalName}
                className="goalName"
              />
            </Col>
            <Col lg={4} className="my-3">
              <CommonInput
                label="Weightage"
                placeholder="Please enter goal weightage"
                width="100%"
                value={goal.goalWeight.toString()}
                onChange={(e) => handleGoalWeight(index, e.target.value)}
              />
            </Col>
          </>
        ))}
      </Row> */}
      <Row className="mx-0">
        <Col lg={9}>
          <p className="mt-3 ps-lg-4 totalWeight font14 font400">
            Total Secondary Goal weightage -{' '}
            <span className="percentage">100%</span>
          </p>
        </Col>
        <Col lg={3}>
          <p className="mt-3 pe-2 totalWeight font14 font400">
            Total Weightage: -{' '}
            <span
              className={
                weight.reduce((sum, goal) => sum + goal.goalWeight, 0) !== 100
                  ? 'text-danger'
                  : 'percentage'
              }
            >
              {weight.reduce((sum, goal) => sum + goal.goalWeight, 0)}%
            </span>
          </p>
        </Col>
      </Row>
      <Modal.Footer className="justify-content-start">
        <SharedButton
          label={label === 'Manage gols weightage' ? 'Previous' : 'Cancel'}
          variant="outline"
          onClick={closeForm}
        />
        {label === 'Edit weightage' || label === 'Update weightage' ? (
          <SharedButton
            label="Update"
            disabled={isSaveDisabled}
            onClick={handleUpdate}
          >
            {updateGoalLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              ''
            )}
          </SharedButton>
        ) : (
          <SharedButton
            label="Save & Publish"
            disabled={isSaveDisabled}
            onClick={handlePublish}
          >
            {createGoalLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              ''
            )}
          </SharedButton>
        )}
      </Modal.Footer>
    </>
  )
}

export default ManageWeight
