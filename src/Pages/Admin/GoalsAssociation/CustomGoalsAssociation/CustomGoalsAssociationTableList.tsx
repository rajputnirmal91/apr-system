import { useCallback, useEffect, useMemo, useState } from 'react'

import { Container, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'

import deleteBlack from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import edit from '@project/assets/images/Edit.svg'
import eye from '@project/assets/images/Eye.svg'
import RedInfo from '@project/assets/images/redInfo.svg'
import Spinner from '@project/Common/Spinner'
import CustomModal from '@project/Components/Modal/Modal'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import {
  useDeleteCustomGoalsAssociatonMutation,
  useGetCustomGoalsTableListQuery,
} from '@project/Store/Api/Admin/GoalsAssociation'
import { useGoalListQuery } from '@project/Store/Api/Admin/Masters/Goals'
import { CustomGoalsTableItem } from '@project/Types/goalsAssociationTypes'
import { showSuccessToast } from '@project/Utils/notificationPopup'

import '../GoalsAssociation.scss'
import './CustomGoalsAssociation.scss'

type Props = {
  onView?: (goalId: string | number) => void
  onEdit?: (goal: CustomGoalsTableItem) => void
  search?: string
}

type GoalItem = {
  goal_type: number
}

export default function CustomGoalsAssociationTableList({
  onView,
  onEdit,
  // onDelete,
  search,
}: Props): JSX.Element {
  /* ================= API CALL ================= */
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [selectedGoal, setSelectedGoal] = useState<CustomGoalsTableItem | null>(null)
  const [localGoals, setLocalGoals] = useState<CustomGoalsTableItem[]>([])
  const { data, isLoading } = useGetCustomGoalsTableListQuery()
  const [deleteCustomGoal] = useDeleteCustomGoalsAssociatonMutation()

  const { data: goalsList } = useGoalListQuery({
    page: 1,
    limit: 1000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  })

  const typeZeroGoalsLength = useMemo(() => {
    return (
      goalsList?.goals?.filter((goal: GoalItem) => goal.goal_type === 0)?.length ?? 0
    )
  }, [goalsList])

  // const goals = data || []
  const goals = localGoals

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedGoal) return

    try {
      const res = await deleteCustomGoal({
        designation_id: selectedGoal.designation_id,
        id: selectedGoal.id,
      }).unwrap()

      // Update local state
      setLocalGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id))

      setShowDeleteModal(false)
      setSelectedGoal(null)

      showSuccessToast(res?.message || 'Goal deleted successfully')
    } catch (error) {
      setShowDeleteModal(false)
      console.error('Delete failed:', error)
    }
  }, [selectedGoal, deleteCustomGoal])

  /* ================= SEARCH FILTER ================= */
  const filteredGoals = useMemo(() => {
    if (!search || !search.trim()) return goals

    const keyword = search.trim().toLowerCase()
    return goals.filter((goal) => {
      // Convert entire object to searchable text
      const searchableText = [
        goal.designation,
        ...(goal.goal_names || []),
        ...(goal.kra_names || []),
        ...(goal.sub_kra_names || []),
      ]
        .join(' ')
        .toLowerCase()
        .replace(/\s+/g, ' ')

      return searchableText.includes(keyword)
    })
  }, [goals, search])

  /* ============ Helper for + count ============ */

  const renderWithCount = (list?: string[]) => {
    if (!list || list.length === 0) return <span>-</span>

    if (list.length === 1) {
      return <span className="itemName">{list[0]}</span>
    }

    return (
      <>
        <span className="itemName">{list[0]}</span>
        <span className="primaryColor"> +{list.length - 1}</span>
      </>
    )
  }

  /* ================= Loading ================= */

  useEffect(() => {
    if (data) {
      setLocalGoals(data)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <span>
        <Spinner />
        </span>
      </div>
    )
  }

  return (
    <Container fluid className="p-0 customGoalsDesignationList">
      {filteredGoals?.length > 0 ? (
        <Table className="table customGoalsAssociationTable custom-table">
          <thead className="custom-thead" style={{ position: 'relative' }}>
            <tr className="custom-thead-row">
              <th>Designation</th>
              <th>Goal</th>
              <th>KRA</th>
              <th>Secondary KRA</th>
              <th style={{ maxWidth: '10%' }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGoals?.map((goal, index) => (
              <tr key={goal.designation_id || index}>
                {/* Designation */}
                <td>
                  {goal.designation || '-'}
                  {goal.is_form_published && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip
                          id={`tooltip-${goal.designation_id}`}
                          className="published-tooltip"
                        >
                          Status: Form Published — Editing restricted
                        </Tooltip>
                      }
                    >
                      <img src={RedInfo} alt="InfoIcon" className="info-icon" />
                    </OverlayTrigger>
                  )}
                </td>
                <td>{renderWithCount(goal.goal_names)}</td>

                {/* KRA */}
                <td>{renderWithCount(goal.kra_names)}</td>

                {/* Secondary KRA */}
                <td>{renderWithCount(goal.sub_kra_names)}</td>

                {/* Actions */}
                <td className="actionIcons">
                  <button
                    type="button"
                    onClick={() => onView?.(goal.designation_id)}
                    className="icon-btn"
                  >
                    <img src={eye} alt="View" />
                  </button>

                  <button
                    type="button"
                    disabled={goal.is_form_published}
                    onClick={() => onEdit?.(goal)}
                    className="icon-btn disableBtn"
                  >
                    <img src={edit} alt="Edit" />
                  </button>

                  <button
                    type="button"
                    disabled={goal.is_form_published}
                    onClick={() => {
                      setSelectedGoal(goal)
                      setShowDeleteModal(true)
                    }}
                    className="icon-btn disableBtn"
                  >
                    <img src={deleteBlack} alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-5 customGoalsEmptyState">
          {typeZeroGoalsLength === 0 ? (
            <NoRecordFound
              heading="No Custom Goals Associate "
              description="Currently, no custom goals avaliable in the master."
              className="centerNoRecord"
            />
          ) : (
            <NoRecordFound
              heading="No designation associated with goals"
              description="Currently, no designation is associated with goals. please associate."
              className="centerNoRecord"
            />
          )}
        </div>
      )}

      <CustomModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedGoal(null)
        }}
        image={DeleteWhiteIcon}
        onConfirm={handleConfirmDelete}
        type="Warning"
        modalHeading="Are you sure want to delete this Custom Goal?"
        modalDesc="Deleting this Goals will also remove all associated KRAs and Secondary KRAs. Do you want to proceed?"
        mode="confirm"
      />
    </Container>
  )
}
 