import { useEffect, useState } from 'react'

import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import DeleteBlackIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import GoalNotFound from '@project/assets/images/noRecordImg.svg'
import SortArrow from '@project/assets/images/sortArrow.svg'
import CustomModal from '@project/Components/Modal/Modal'
import CustomPagination from '@project/Components/Pagination/Pagination'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import AddGoalForm from '@project/Pages/Admin/Master/Goals/AddGoalForm'
import {
  useDeleteGoalMutation,
  useGoalListQuery,
} from '@project/Store/Api/Admin/Masters/Goals'
import { GoalData } from '@project/Types/MasterGoals'

type GoalItem = {
  goal_id: string
  id?: string
  goal_name: string
  goal_type: number
  goal_weightage: number
  is_associated: boolean
}

type GoalListProps = {
  refetchData: boolean
  search: string
  showGoalForm: boolean
}

function GoalList({ refetchData, search, showGoalForm }: GoalListProps) {
  const [showEditForm, setEditForm] = useState<boolean>(false)
  const [sort, setSort] = useState<string>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [sortName, setSortName] = useState<string>('goal_name')
  const {
    data,
    isLoading: ListLoading,
    isError: ListError,
    refetch,
  } = useGoalListQuery({
    page: currentPage,
    limit: itemsPerPage,
    search,
    order_by: sort,
    sort_by: sortName,
  })
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [editData, setEditData] = useState<GoalData>({
    id: '',
    goal_name: '',
    goal_type: 0,
  })
  const [associatePopup, setAssociatePopup] = useState<boolean>(false)
  const [cancelUpdateModal, setCancelUpdateModal] = useState<boolean>(false)
  const [deleteGoal] = useDeleteGoalMutation()

  useEffect(() => {
    if (refetchData) refetch()
  }, [refetchData, refetch, sort, sortName, currentPage])

  if (ListLoading) {
    return <p>Loading the goals ...</p>
  }
  if (ListError) {
    return <p> Getting error while fetching the data</p>
  }

  const handleEdit = (item: GoalItem) => {
    setEditData({
      id: item.goal_id,
      goal_name: item.goal_name,
      goal_type: item.goal_type,
    })
    setEditForm(true)
  }

  const handleAssociateModalOpen = () => {
    setAssociatePopup(true)
  }

  const handleDeleteModalOpen = (id: string, associated: boolean) => {
    if (!associated) {
      setDeleteId(id)
      setShowDeleteModal(true)
    } else {
      handleAssociateModalOpen()
    }
  }

  const handleSort = (sortBy: string) => {
    const newOrder = sort === 'asc' ? 'desc' : 'asc'
    setSortName(sortBy)
    setSort(newOrder)
  }

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false)
  }

  const handleDeleteConfirm = () => {
    const deleteData = {
      id: deleteId,
      is_deleted: true,
    }

    deleteGoal(deleteData)
      .unwrap()
      .then(() => {
        handleDeleteModalClose()
        refetch()
      })
  }

  const handleCancelModalClose = () => {
    setCancelUpdateModal(false)
  }

  const handleAssociateModalClose = () => {
    setAssociatePopup(false)
  }

  const handleEditFormClose = () => {
    setEditForm(false)
    handleCancelModalClose()
  }

  const handleEditFormOpen = () => {
    setEditForm(true)
  }

  const handleGoalFormClose = () => {
    setEditForm(false)
  }

  return (
    <>
      <AddGoalForm
        show={showEditForm}
        handleGoalFormOpen={handleEditFormOpen}
        goalFormLabel="Edit goal"
        closeForm={handleGoalFormClose}
        editData={editData}
        handleDataRefetch={refetch}
      />
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
        modalHeading="Goal delete not possible"
        modalDesc="This goal is already used so can not delete this goal."
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
      <div
        className={`userTableMain commonTable ${showGoalForm ? 'form-open' : ''}`}
      >
        {data?.goals && data?.goals.length > 0 ? (
          <>
            <TableResponsive maxHeight="55vh">
              <table className="table custom-table">
                <thead className="custom-thead">
                  <tr className="custom-thead-row">
                    <th scope="col" className="custom-th font16 font400">
                      <div className="d-flex align-items-center gap-2 ">
                        <span className="font16 font400 fontOnest">
                          Goal Name
                        </span>
                        <button
                          className="transparentButton sortButton pb-2"
                          onClick={() => handleSort('goal_name')}
                        >
                          <img
                            src={SortArrow}
                            alt="sortIcon"
                            className="sortIcon"
                          />
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="custom-th font14 font400">
                      <div className="d-flex align-items-center gap-2">
                        <span className="font16 font400 fontOnest">
                          Goal Type
                        </span>
                        <button
                          className="transparentButton sortButton pb-2"
                          onClick={() => handleSort('goal_type')}
                        >
                          <img
                            src={SortArrow}
                            alt="sortIcon"
                            className="sortIcon"
                          />
                        </button>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="custom-th font16 font400 fontOnest"
                    >
                      <span className="font16 font400 fontOnest">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.goals.map((item) => (
                    <tr key={item.id} className="custom-row">
                      <td className="custom-td font16 font400 fontOnest">
                        <p className="mb-0 font14 font400 fontOnest textDark">
                          {item.goal_name}
                        </p>
                      </td>
                      <td className="custom-td">
                        <p className="mb-0 font14 font400 fontOnest textDark">
                          {item.goal_type === 0 ? 'Custom' : 'Global'}
                        </p>
                      </td>
                      <td className="custom-td">
                        <div>
                          <div>
                            <button
                              disabled={showGoalForm}
                              className="transparentButton"
                              onClick={() => handleEdit(item)}
                            >
                              <img src={EditIcon} alt="editIcon" />
                            </button>
                            <button
                              disabled={showGoalForm}
                              className="transparentButton"
                              onClick={() =>
                                handleDeleteModalOpen(
                                  item.goal_id,
                                  item.is_associated
                                )
                              }
                            >
                              <img
                                src={DeleteBlackIcon}
                                alt="deleteIcon"
                                className="px-3"
                              />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableResponsive>
            <CustomPagination
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalRows={data?.total_count || 0}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center mt-4">
            <img src={GoalNotFound} alt="Not Found" />
          </div>
        )}
      </div>
    </>
  )
}

export default GoalList
