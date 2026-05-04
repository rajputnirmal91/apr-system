import { useEffect, useMemo, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { showErrorToast } from '@project/Utils/notificationPopup'

type WeightList = {
  id: string | null
  goalId?: string | null
  goalName: string
  goalType: string
  goalWeight: number
  is_associated?: boolean
}

type ManageWeightMode = 'create' | 'manage' | 'update'

type GoalSubmitItem = {
  goal_id: string | null
  goal_name: string
  goal_type: number
  goal_weightage: number
  is_associated?: boolean
}

type GoalSubmitPayload = {
  goals: GoalSubmitItem[]
  delete_goal?: {
    goal_id: string
  }
}

type ManageWeightProps = {
  mode?: ManageWeightMode
  label: string
  manageWeight: WeightList[]
  handleDataRefetch?: () => unknown | Promise<unknown>
  closeForm?: () => void
  deleteGoalId?: string
  addGoalModalClose?: () => void
  isSubmitting?: boolean
  onSubmit?: (
    payload: GoalSubmitPayload,
    mode: ManageWeightMode
  ) => Promise<unknown>
  createdGoalIds?: string[]
  onMappingSaved?: (
    goals: {
      id: string
      goal_id: string
      goal_name: string
      goal_type: number
      goal_weightage: number
      is_associated: boolean
    }[]
  ) => void
}

function ManageWeight({
  mode,
  label,
  manageWeight,
  handleDataRefetch,
  closeForm,
  deleteGoalId,
  addGoalModalClose,
  isSubmitting,
  onSubmit,
  createdGoalIds,
  onMappingSaved,
}: ManageWeightProps) {
  const currentMode: ManageWeightMode = mode ?? 'manage'

  const [weight, setWeight] = useState<WeightList[]>([])
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const resolveGoalId = (goal: WeightList): string | null => {
    return goal.goalId ?? null
  }

  useEffect(() => {
    if (manageWeight?.length) {
      setWeight(manageWeight)
    }
  }, [manageWeight])

  useEffect(() => {
    const allWeightsFilled = weight.every((goal) => goal.goalWeight > 0)
    const totalWeight = weight.reduce((sum, goal) => sum + goal.goalWeight, 0)
    if (currentMode === 'update') {
      setIsSaveDisabled(!allWeightsFilled)
    } else {
      setIsSaveDisabled(!(allWeightsFilled && totalWeight === 100))
    }
  }, [weight, currentMode])

  const handleGoalWeight = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, '')

    setWeight((prev) => {
      const updatedList = [...prev]
      updatedList[index] = {
        ...updatedList[index],
        goalWeight: Number(sanitizedValue) || 0,
      }
      return updatedList
    })
  }

  const handleSubmit = async () => {
    if (!onSubmit) {
      showErrorToast('Submit handler is missing.')
      return
    }

    const requiresGoalId = currentMode !== 'create' || Boolean(deleteGoalId)

    const updatedGoalList = weight
      .map((goal) => {
        const goalId = resolveGoalId(goal)

        if (requiresGoalId && !goalId) {
          showErrorToast(`Goal ID is missing for ${goal.goalName}`)
          return null
        }

        return {
          goal_id: goalId,
          goal_name: goal.goalName.trim(),
          goal_type: Number(goal.goalType),
          goal_weightage: Number(goal.goalWeight),
          is_associated: goal.is_associated,
        }
      })
      .filter((goal): goal is NonNullable<typeof goal> => goal !== null)

    if (updatedGoalList.length === 0 && !deleteGoalId) {
      showErrorToast('No valid goals to submit')
      return
    }

    const formData: GoalSubmitPayload = deleteGoalId
      ? {
        goals: updatedGoalList,
        delete_goal: {
          goal_id: deleteGoalId,
        },
      }
      : {
        goals: updatedGoalList,
      }

    try {
      await onSubmit(formData, currentMode)

      if (
        currentMode === 'create' &&
        onMappingSaved &&
        createdGoalIds?.length
      ) {
        const appendedGoals = weight
          .filter(
            (goal) =>
              typeof goal.goalId === 'string' &&
              createdGoalIds.includes(goal.goalId)
          )
          .map((goal) => ({
            id: goal.id ?? (goal.goalId as string),
            goal_id: goal.goalId as string,
            goal_name: goal.goalName,
            goal_type: Number(goal.goalType),
            goal_weightage: Number(goal.goalWeight),
            is_associated: goal.is_associated ?? false,
          }))

        onMappingSaved(appendedGoals)
      }

      await handleDataRefetch?.()
      closeForm?.()
      addGoalModalClose?.()
    } catch (error: unknown) {
      let fallbackMessage = 'Failed to update weightage.'

      if (deleteGoalId) {
        fallbackMessage = 'Failed to delete goal.'
      } else if (currentMode === 'create') {
        fallbackMessage = 'Failed to save weightage.'
      }

      const message =
        (error as { data?: { detail?: string } })?.data?.detail ||
        fallbackMessage
      showErrorToast(message)
    }
  }

  const globalGoals = useMemo(
    () => weight.filter((goal) => goal.goalType === '0'),
    [weight]
  )
  const customGoals = useMemo(
    () => weight.filter((goal) => goal.goalType === '1'),
    [weight]
  )
  const totalWeight = useMemo(
    () => weight.reduce((sum, g) => sum + g.goalWeight, 0),
    [weight]
  )

  const globalWeight = useMemo(
    () => globalGoals.reduce((sum, g) => sum + g.goalWeight, 0),
    [globalGoals]
  )
  const customWeight = useMemo(
    () => customGoals.reduce((sum, g) => sum + g.goalWeight, 0),
    [customGoals]
  )

  const findWeightIndex = (goal: WeightList) => {
    return weight.findIndex((w) => {
      if (w.id && goal.id) {
        return w.id === goal.id
      }
      return w.goalName === goal.goalName && w.goalType === goal.goalType
    })
  }

  return (
    <>
      <Row
        className="addNewGoalMain mx-0"
        style={{ backgroundColor: '#ffffff' }}
      >
        <Col lg={12} className="addNewGoalHead">
          <div>
            <h3 className="font20 font400 fontOnest">{label}</h3>
          </div>
        </Col>
      </Row>
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {globalGoals?.length > 0 && (
          <div className="userTableMain commonTable px-4 mt-3">
            <h4 className="font16 font400 fontOnest">Custom Goals</h4>
            <TableResponsive maxHeight="50vh">
              <table className="table manageWeightageTable">
                <thead className="custom-thead">
                  <tr className="custom-thead-row">
                    <th scope="col" className="custom-th font14 font400">
                      Goal Name
                    </th>
                    <th scope="col" className="custom-th font14 font400">
                      Goal Weightage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {globalGoals.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3">
                        <span>No data found</span>
                      </td>
                    </tr>
                  ) : (
                    globalGoals.map((goal) => {
                      const weightIndex = findWeightIndex(goal)
                      return (
                        <tr
                          className="custom-row"
                          key={goal.id ?? goal.goalName}
                        >
                          <td className="manageWeightage">{goal.goalName}</td>
                          <td className="manageWeightage">
                            <CommonInput
                              placeholder="Please enter goal weightage"
                              width="100%"
                              height="40px"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={3}
                              value={goal.goalWeight.toString()}
                              onChange={(e) =>
                                handleGoalWeight(weightIndex, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </TableResponsive>
            <Row className="mx-0 mt-2">
              <Col>
                <p className="totalWeight font14 font400">
                  Total custom goals weightage:{' '}
                  <span
                    className={
                      totalWeight !== 100 ? 'text-danger' : 'percentage'
                    }
                  >
                    {globalWeight}%
                  </span>
                </p>
              </Col>
            </Row>
          </div>
        )}

        {/* Global Goals Table */}
        {customGoals?.length > 0 && (
          <div className="userTableMain commonTable px-4 mt-3">
            <h4 className="font16 font400 fontOnest">Global Goals</h4>
            <TableResponsive maxHeight="50vh">
              <table className="table manageWeightageTable">
                <thead className="custom-thead">
                  <tr className="custom-thead-row">
                    <th scope="col" className="custom-th font14 font400">
                      Goal Name
                    </th>
                    <th scope="col" className="custom-th font14 font400">
                      Goal Weightage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customGoals.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-3">
                        <span>No data found</span>
                      </td>
                    </tr>
                  ) : (
                    customGoals.map((goal) => {
                      const weightIndex = findWeightIndex(goal)
                      return (
                        <tr
                          className="custom-row"
                          key={goal.id ?? goal.goalName}
                        >
                          <td
                            className="manageWeightage"
                            style={{ wordBreak: 'break-all' }}
                          >
                            {goal.goalName}
                          </td>
                          <td className="manageWeightage">
                            <CommonInput
                              placeholder="Please enter goal weightage"
                              width="100%"
                              height="40px"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={3}
                              value={goal.goalWeight.toString()}
                              onChange={(e) =>
                                handleGoalWeight(weightIndex, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </TableResponsive>
            <Row className="mx-0 mt-2">
              <Col>
                <p className="totalWeight font14 font400">
                  Total global goals weightage:{' '}
                  <span
                    className={
                      totalWeight !== 100 ? 'text-danger' : 'percentage'
                    }
                  >
                    {customWeight}%
                  </span>
                </p>
              </Col>
            </Row>
          </div>
        )}
      </div>
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          <SharedButton
            label="Cancel"
            variant="outline"
            onClick={() => setShowCancelModal(true)}
          />
          <SharedButton
            label={mode === 'update' || mode === 'manage' ? 'Update' : 'Save'}
            disabled={isSaveDisabled}
            onClick={handleSubmit}
          >
            {isSubmitting && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </SharedButton>
        </div>

        <p className="totalWeight font14 font600 mb-0 text-end">
          Total Weightage:{' '}
          <span className={totalWeight !== 100 ? 'text-danger' : 'percentage'}>
            {totalWeight}%
          </span>
        </p>
      </Modal.Footer>

      <CustomModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false)
          if (closeForm) closeForm()
        }}
        image={CloseWhiteIcon}
        type="Warning"
        modalHeading="Are you sure you want to cancel?"
        modalDesc="If you continue, unsaved weightage changes will be lost."
        mode="confirm"
      />
    </>
  )
}

export default ManageWeight
