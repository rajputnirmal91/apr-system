import { useEffect, useState } from 'react'

import { Modal } from 'react-bootstrap'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import DeleteBlackIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import CustomModal from '@project/Components/Modal/Modal'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import CustomPagination from '@project/Components/Pagination/Pagination'
import ManageWeight from '@project/Pages/Admin/Master/GoalMapping/ManageWeight'
import {
  useDeleteLastGoalMutation,
  useGoalListQuery,
  useLazyGoalListQuery,
  useUpdateGoalWeightageMutation,
} from '@project/Store/Api/Admin/Masters/Goals'
import { showErrorToast } from '@project/Utils/notificationPopup'

type GoalListProps = {
  typeFilter?: string | number
  search?: string
  showGoalForm?: boolean
  refetchData?: boolean
  appendGoals?: GoalResponse[]
  onEditGoal?: (goalData: {
    goal_id: string
    goalName: string
    goalType: string
    goalWeight: number
  }) => void
}

type GoalResponse = {
  goal_id: string
  id?: string
  goal_name: string
  goal_type: number
  goal_weightage: number
  is_associated: boolean
}

type GoalUI = {
  id: string | null
  goalId?: string
  goalName: string
  goalType: string
  goalWeight: number
  is_associated?: boolean
}

function GoalsMapList({
  typeFilter,
  search,
  showGoalForm,
  refetchData,
  appendGoals,
  onEditGoal,
}: GoalListProps) {
  const [updateGoalWeightage, { isLoading: manageWeightageLoading }] =
    useUpdateGoalWeightageMutation()

  const [deleteLastGoal] = useDeleteLastGoalMutation()
  const [fetchGoalsForDeletePopup, { isLoading: isDeletePopupGoalsLoading }] =
    useLazyGoalListQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sort, setSort] = useState<string>('asc')
  const [sortName, setSortName] = useState<string>('goal_name')
  const deletePopupGoalsQuery = {
    page: 1,
    limit: 10000,
    search: '',
    order_by: 'asc',
    sort_by: 'goal_name',
  }

  const normalizedSearch = search || ''
  const normalizedTypeFilter =
    typeFilter !== undefined ? String(typeFilter) : '-1'
  const [prevSearch, setPrevSearch] = useState<string>(normalizedSearch)

  const effectivePage = normalizedSearch !== prevSearch ? 1 : currentPage

  const {
    data,
    isLoading: ListLoading,
    isError: ListError,
    refetch,
  } = useGoalListQuery({
    page: effectivePage,
    limit: itemsPerPage,
    search: normalizedSearch,
    order_by: sort,
    sort_by: sortName,
    goal_type: normalizedTypeFilter !== '-1' ? normalizedTypeFilter : undefined,
  })

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [goalId, setGoalId] = useState<string>('')

  const [updateWeightage, setUpdateWeightage] = useState<boolean>(false)
  const [weightageGoals, setWeightageGoals] = useState<GoalUI[]>([])
  const [associatePopup, setAssociatePopup] = useState<boolean>(false)
  const [cancelUpdateModal, setCancelUpdateModal] = useState<boolean>(false)
  const [associatePopupMessage, setAssociatePopupMessage] = useState<string>('')

  useEffect(() => {
    if (refetchData) refetch()
  }, [refetchData, refetch])

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  useEffect(() => {
    setPrevSearch(normalizedSearch)
    setCurrentPage(1)
  }, [normalizedSearch])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    setCurrentPage(1)
  }, [normalizedTypeFilter])

  const handleCancelModalClose = () => {
    setCancelUpdateModal(false)
  }

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false)
  }

  const handleManageWeightModalClose = async () => {
    setUpdateWeightage(false)
    await refetch()
    const totalRows = (data?.total_count || 0) - 1
    const maxPage = Math.ceil(totalRows / itemsPerPage)

    if (currentPage > maxPage) {
      setCurrentPage(1)
    }
  }

  const handleAssociateModalOpen = () => {
    setAssociatePopup(true)
  }

  const handleAssociateModalClose = () => {
    setAssociatePopup(false)
  }

  if (ListLoading) {
    return <p>Loading the goals ...</p>
  }
  if (ListError) {
    return <p> Getting error while fetching the data</p>
  }

  const displayGoals = (() => {
    const normalizedGoals = data?.goals ?? []

    const mergedGoals = (() => {
      if (!appendGoals || appendGoals.length === 0) return normalizedGoals

      const existingGoalIds = new Set(normalizedGoals.map((g) => g.goal_id))
      const appendedUnique = appendGoals.filter(
        (goal) => !existingGoalIds.has(goal.goal_id)
      )

      return [...appendedUnique, ...normalizedGoals]
    })()

    if (normalizedTypeFilter === '-1') return mergedGoals

    return mergedGoals.filter(
      (goal) => String(goal.goal_type) === normalizedTypeFilter
    )
  })()

  const handleDeleteModalOpen = (
    id: string,
    goalId1: string | undefined,
    associated: boolean
  ) => {
    if (!associated) {
      setDeleteId(id)
      setGoalId(goalId1 || id)
      setShowDeleteModal(true)
    } else {
      setAssociatePopupMessage('delete')
      handleAssociateModalOpen()
    }
  }

  const handleEditClick = (goal: GoalResponse) => {
    if (goal?.is_associated) {
      setAssociatePopupMessage('edit')
      handleAssociateModalOpen()
    } else if (onEditGoal) {
      onEditGoal({
        goal_id: goal.goal_id,
        goalName: goal.goal_name,
        goalType: goal.goal_type === 0 ? 'Custom goal' : 'Global goal',
        goalWeight: goal.goal_weightage,
      })
    }
  }

  const handleSort = (sortBy: string) => {
    const newOrder = sort === 'asc' ? 'desc' : 'asc'
    setSortName(sortBy)
    setSort(newOrder)
  }

  const convertGoals = (goals?: GoalResponse[]): GoalUI[] => {
    if (!goals || goals.length === 0) {
      return []
    }

    return goals
      .filter((goal) => goal.goal_id !== deleteId)
      .map((goal) => ({
        id: goal.goal_id ?? null,
        goalId: goal.goal_id,
        goalName: goal.goal_name,
        goalType: String(goal.goal_type),
        goalWeight: goal.goal_weightage,
        is_associated: goal.is_associated,
      }))
  }

  const prepareWeightageDataForDelete = async () => {
    try {
      const latestResponse = await fetchGoalsForDeletePopup(
        deletePopupGoalsQuery,
        true
      ).unwrap()

      const latestGoals = latestResponse?.goals ?? []

      const filteredGoals = latestGoals.filter(
        (goal) => goal.goal_id !== goalId
      )

      setWeightageGoals(convertGoals(filteredGoals))
      setUpdateWeightage(true)
    } catch {
      showErrorToast('Failed to fetch latest goals for weightage update.')
    }
  }

  const handleSingleGoalDelete = async () => {
    const targetGoalId = goalId || deleteId
    if (!targetGoalId) return

    try {
      await deleteLastGoal({
        goal_id: targetGoalId,
      }).unwrap()
      await refetch()
      const totalRows = (data?.total_count || 0) - 1
      const maxPage = Math.ceil(totalRows / itemsPerPage)

      if (currentPage > maxPage) {
        setCurrentPage(1)
      }
    } finally {
      setDeleteId('')
      setGoalId('')
    }
  }

  const handleDeleteConfirm = async () => {
    handleDeleteModalClose()
    if (displayGoals?.length > 1) {
      await prepareWeightageDataForDelete()
      return
    }
    await handleSingleGoalDelete()
  }

  const handleEditFormClose = () => {
    handleCancelModalClose()
  }

  return (
    <>
      <div
        className={`userTableMain commonTable goalMapListPage ${showGoalForm ? 'form-open' : ''}`}
      >
        {(() => {
          const columns: ColumnDef<GoalResponse>[] = [
            { key: 'goal_name', header: 'Goal Name', sortable: true },
            { key: 'goal_type', header: 'Goal Type', sortable: true },
            { key: 'goal_weightage', header: 'Goal Weightage', sortable: true },
            { key: 'action', header: 'Action' },
          ]

          return (
            <>
              <GenericTable<GoalResponse>
                columns={columns}
                data={displayGoals}
                keyExtractor={(item) => item.goal_id}
                onSort={(key) => handleSort(key)}
                emptyState={{
                  heading: 'No goals found',
                  description:
                    'Currently, no goals is available. please add goal',
                }}
                renderRow={(item) => (
                  <tr key={item.goal_id} className="custom-row">
                    <td className="custom-td font16 font400">
                      {item.goal_name}
                    </td>
                    <td className="custom-td">
                      {item.goal_type === 0 ? 'Custom' : 'Global'}
                    </td>
                    <td className="custom-td">{item.goal_weightage}</td>
                    <td className="custom-td">
                      <div className="d-flex align-items-center">
                        <button
                          disabled={showGoalForm}
                          className="transparentButton"
                          onClick={() => handleEditClick(item)}
                        >
                          <img src={EditIcon} alt="editIcon" className="px-2" />
                        </button>
                        <button
                          disabled={showGoalForm}
                          className="transparentButton"
                          onClick={() =>
                            handleDeleteModalOpen(
                              item.goal_id,
                              item.goal_id,
                              item.is_associated
                            )
                          }
                        >
                          <img
                            src={DeleteBlackIcon}
                            alt="deleteIcon"
                            className="px-2"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
              {displayGoals.length > 0 && (
                <CustomPagination
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalRows={data?.total_count || 0}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )
        })()}
      </div>

      <Modal
        show={updateWeightage}
        onHide={handleManageWeightModalClose}
        centered
        backdrop="static"
        keyboard={false}
        size="lg"
        className="custom-modal"
      >
        {isDeletePopupGoalsLoading ? (
          <div className="p-4 text-center">Loading latest goals...</div>
        ) : (
          <ManageWeight
            mode="manage"
            label="Update weightage"
            manageWeight={weightageGoals}
            isSubmitting={manageWeightageLoading}
            onSubmit={(payload) => updateGoalWeightage(payload).unwrap()}
            deleteGoalId={goalId || deleteId}
            handleDataRefetch={refetch}
            closeForm={handleManageWeightModalClose}
          />
        )}
      </Modal>
      <CustomModal
        show={showDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Delete Goal"
        modalDesc="Are you sure you want to delete this Goal?"
        type="Warning"
        mode="confirm"
      />
      <CustomModal
        show={associatePopup}
        onClose={handleAssociateModalClose}
        image={CloseWhiteIcon}
        type="Warning"
        modalHeading={`Goal ${associatePopupMessage} not possible`}
        modalDesc={`This goal is already used so can not ${associatePopupMessage}  this goal.`}
        mode="info"
      />
      <CustomModal
        show={cancelUpdateModal}
        onClose={handleCancelModalClose}
        onConfirm={handleEditFormClose}
        image={CloseWhiteIcon}
        type="Warning"
        modalHeading="Cancel goal update"
        modalDesc="Are you sure you want to cancel this Goal update?"
        mode="confirm"
      />
    </>
  )
}

export default GoalsMapList
