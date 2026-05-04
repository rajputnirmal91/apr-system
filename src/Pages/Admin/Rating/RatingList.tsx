import { useEffect, useState } from 'react'

/* eslint-disable */
import { Col, Container, Modal, Row } from 'react-bootstrap'

import Add from '@project/assets/images/Add.svg'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
//import HatIcon from '@project/assets/images/Employee.svg'
import DeleteIcon from '@project/assets/images/deleteDark.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import Eye from '@project/assets/images/Eye.svg'
import HatIcon from '@project/assets/images/hatBlack.svg'
import TieIcon from '@project/assets/images/tieBlack.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import GenericTable from '@project/Components/GenericTable/GenericTable'
import CustomModal from '@project/Components/Modal/Modal'
import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useDeleteRatingMutation,
  useGetRatingListNewQuery,
} from '@project/Store/Api/Admin/Ratings/rating'
import useDebounce from '@project/Utils/debounce'
import { showSuccessToast } from '@project/Utils/notificationPopup'

import AddRatingPoints from './AddRatingPoints/AddRatingPoints'
import AddRatingRow from './AddRatingRow/AddRatingRow'
import RatingViewDetails from './RatingViewDetails/RatingViewDetails'

import './Rating.scss'

function RatingList() {
  const ratingTabs = [
    { label: 'Unit head', value: 'UnitHead', icon: HatIcon },
    { label: 'Others', value: 'Other', icon: TieIcon },
  ]
  const [activeTab, setActiveTab] = useState<string>(ratingTabs[0].value)
  const [refetch, setRefetch] = useState(false)
  const [showAddRow, setShowAddRow] = useState(false)
  const [showCancelAddModal, setShowCancelAddModal] = useState(false)
  const [saveNewRating, setSaveNewRating] = useState<(() => void) | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saveEditRating, setSaveEditRating] = useState<(() => void) | null>(
    null
  )
  const [isEditFormDirty, setIsEditFormDirty] = useState(false)
  const [showCancelEditModal, setShowCancelEditModal] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [showViewDetails, setShowViewDetails] = useState(false)
  const [selectedRatingId, setSelectedRatingId] = useState<string | null>(null)
  const [iseditMode, setIsEditMode] = useState(false)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)

  // DELETE modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [deleteRatingApi] = useDeleteRatingMutation()

  const { data, refetch: ListRefetch } = useGetRatingListNewQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    order_by: sortOrder,
    sort_by: 'rating_title',
    rating_for: activeTab,
  })

  // DELETE CONFIRM
  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      setIsDeleting(true)
      const response = await deleteRatingApi({
        id: deleteId,
        is_deleted: true,
      }).unwrap()
      showSuccessToast(response?.message)
      setShowDeleteModal(false)
      setDeleteId(null)
      setRefetch(true)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('DELETE ERROR:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (refetch) {
      ListRefetch()
      setRefetch(false)
    }
  }, [refetch, ListRefetch])

  useEffect(() => {
    setSearch('')
    setShowAddRow(false)
    setShowEditModal(false)
    setIsEditMode(false)
    setSelectedRatingId(null)
    setRefetch(true)
    ListRefetch()
  }, [activeTab, ListRefetch])

  const ratingList = data?.ratings || []
  const normalize = (value: string = '') => value.trim().toLowerCase()
  const filteredRatingList = ratingList
  const selectedRatingItem = ratingList.find(
    (item) => item.id === selectedRatingId
  )

  const hasNoRecords = !filteredRatingList || filteredRatingList.length === 0

  const formatTabLabel = (value: string) =>
    value.replace(/([a-z])([A-Z])/g, '$1 $2')

  return (
    <Container fluid className="m-0 p-0 dateTab">
      <div
        className="nav nav-tabs RatingListWrapperTabs"
        role="tablist"
        aria-label="Rating tabs"
      >
        {ratingTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            className={`nav-link ${normalize(activeTab) === normalize(tab.value) ? 'active' : ''
              }`}
            aria-selected={
              normalize(activeTab) === normalize(tab.value) ? 'true' : 'false'
            }
            // onClick={() => setActiveTab(tab.value)}
            onClick={() => {
              if (normalize(activeTab) === normalize(tab.value)) {
                ListRefetch()
              } else {
                setActiveTab(tab.value)
              }
            }}
          >
            <span className="d-flex align-items-center gap-2">
              <img src={tab.icon} alt="" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <TopSearch
        title={`Rating Scales (${formatTabLabel(activeTab)})`}
        buttonLabel="Add Rating"
        buttonToggledLabel="Cancel"
        searchValue={search}
        onSearchChange={(value) => setSearch(value)}
        disabled={hasNoRecords && search.trim() === ''}
        onToggle={() => {
          setShowAddRow((prev) => !prev)
          setIsEditMode(false)
          setSelectedRatingId(null)
        }}
      />
      {(() => {
        const handleSort = () => {
          setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          setRefetch(true)
        }

        type RatingItem = (typeof filteredRatingList)[number]

        const columns = [
          { key: 'rating_title', header: 'Title', sortable: true },
          { key: 'rating_description', header: 'Description', sortable: true },
          { key: 'rating', header: 'Rating', sortable: true },
          { key: 'rating_score', header: 'Score', sortable: true },
          { key: 'is_remarks_mandatory', header: 'Remark', sortable: true },
          { key: 'action', header: 'Action' },
        ]

        return (
          <div className="userTableMain commonTable dateTabTable RatingListWrapper">
            <GenericTable<RatingItem>
              columns={columns}
              data={filteredRatingList}
              keyExtractor={(item) => item.id ?? ''}
              onSort={handleSort}
              emptyState={{
                heading: 'No rating found',
                description: 'Currently, no ratings are displayed.',
              }}
              renderRow={(item) => (
                <tr key={item.id} className="custom-row">
                  <td className="custom-td">
                    <span className="text-ellipsis ratingTextEllipsis">
                      {item.rating_title}
                    </span>
                  </td>
                  <td className="custom-td">
                    <span className="text-ellipsis ratingTextEllipsis">
                      {item.rating_description}
                    </span>
                  </td>
                  <td className="custom-td">
                    <span className="mb-0 font14 font400 fontOnest">
                      {item.rating}
                    </span>
                  </td>
                  <td className="custom-td">
                    <span>{item.rating_score}</span>
                  </td>
                  <td className="custom-td">
                    <span>{item.is_remarks_mandatory ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="custom-td">
                    <div className="d-flex gap-3">
                      <button
                        className="transparentButton"
                        onClick={() => {
                          setSelectedRatingId(item.id)
                          setShowViewDetails(true)
                        }}
                      >
                        <img src={Eye} alt="Eye" />
                      </button>
                      <button
                        className="transparentButton"
                        onClick={() => {
                          setSelectedRatingId(item.id)
                          setIsEditMode(true)
                          setShowAddRow(false)
                          setIsEditFormDirty(false)
                          setShowEditModal(true)
                        }}
                      >
                        <img src={EditIcon} alt="Edit" />
                      </button>
                      <button
                        className="transparentButton"
                        onClick={() => {
                          setDeleteId(item.id)
                          setShowDeleteModal(true)
                        }}
                      >
                        <img src={DeleteIcon} alt="Delete" />
                      </button>
                      <button
                        className="transparentButton"
                        onClick={() => {
                          setSelectedRatingId(item.id)
                          setShowRatingForm(true)
                        }}
                      >
                        <img src={Add} alt="Add" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
            {filteredRatingList.length > 0 && (
              <CustomPagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalRows={data?.total_count || 0}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        )
      })()}
      {/* Add Rating Points Modal */}
      {showRatingForm && (
        <AddRatingPoints
          show={showRatingForm}
          ratingId={selectedRatingId}
          onClose={() => setShowRatingForm(false)}
          onSuccess={() => setRefetch(true)}
        />
      )}

      <Modal
        show={showAddRow && !iseditMode}
        onHide={() => setShowCancelAddModal(true)}
        centered
        size="sm"
        dialogClassName="custom-modal rating-modal-sm"
        backdrop="static"
        keyboard={false}
      >
        <Row className="addNewGoalMain">
          <Col lg={12} className="addNewGoalHead">
            <div>
              <h3 className="font16 font400 fontOnest">
                Add Rating ({formatTabLabel(activeTab)})
              </h3>
            </div>
          </Col>
          <Col className="whiteBg addGoal">
            <AddRatingRow
              onCancel={() => setShowAddRow(false)}
              onSuccess={() => {
                setShowAddRow(false)
                setRefetch(true)
              }}
              iseditMode={false}
              ratingFor={activeTab}
              existingRatings={ratingList}
              layout="form"
              onRegisterSave={(fn) => setSaveNewRating(() => fn)}
            />
          </Col>
          <Modal.Footer className="border-0 justify-content-start">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={() => setShowCancelAddModal(true)}
            />
            <SharedButton label="Save" onClick={() => saveNewRating?.()} />
          </Modal.Footer>
        </Row>
      </Modal>

      <Modal
        show={showEditModal && iseditMode}
        onHide={() => setShowCancelEditModal(true)}
        centered
        size="sm"
        dialogClassName="custom-modal rating-modal-sm"
        backdrop="static"
        keyboard={false}
      >
        <Row className="addNewGoalMain">
          <Col lg={12} className="addNewGoalHead">
            <div>
              <h3 className="font16 font400 fontOnest">
                {selectedRatingItem ? 'Edit Rating' : 'Add Rating'} (
                {formatTabLabel(activeTab)})
              </h3>
            </div>
          </Col>
          <Col className="whiteBg addGoal">
            <AddRatingRow
              onCancel={() => {
                setShowEditModal(false)
                setIsEditMode(false)
                setSelectedRatingId(null)
                setIsEditFormDirty(false)
              }}
              onSuccess={() => {
                setShowEditModal(false)
                setIsEditMode(false)
                setSelectedRatingId(null)
                setIsEditFormDirty(false)
                setRefetch(true)
              }}
              iseditMode
              editData={selectedRatingItem}
              ratingFor={activeTab}
              existingRatings={ratingList}
              layout="form"
              onRegisterSave={(fn) => setSaveEditRating(() => fn)}
              onDirtyChange={setIsEditFormDirty}
            />
          </Col>
          <Modal.Footer className="border-0 justify-content-start">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={() => setShowCancelEditModal(true)}
            />
            <SharedButton
              label="Save"
              onClick={() => saveEditRating?.()}
              disabled={!isEditFormDirty}
            />
          </Modal.Footer>
        </Row>
      </Modal>

      {/* View Details Modal */}
      {showViewDetails && (
        <RatingViewDetails
          show={showViewDetails}
          ratingId={selectedRatingId}
          onClose={() => setShowViewDetails(false)}
        />
      )}

      {/* DELETE CONFIRMATION */}
      <CustomModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteId(null)
        }}
        onConfirm={handleDeleteConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Delete Rating"
        modalDesc="Are you sure you want to delete this rating?"
        type="Warning"
        mode="confirm"
        loading={isDeleting}
      />

      <CustomModal
        show={showCancelAddModal}
        onClose={() => setShowCancelAddModal(false)}
        onConfirm={() => {
          setShowCancelAddModal(false)
          setShowAddRow(false)
        }}
        image={CloseWhiteIcon}
        modalHeading="Cancel Rating"
        modalDesc="Are you sure you want to cancel the rating?"
        type="Warning"
      />

      <CustomModal
        show={showCancelEditModal}
        onClose={() => setShowCancelEditModal(false)}
        onConfirm={() => {
          setShowCancelEditModal(false)
          setShowEditModal(false)
          setIsEditMode(false)
          setSelectedRatingId(null)
          setIsEditFormDirty(false)
        }}
        image={CloseWhiteIcon}
        modalHeading="Cancel Rating"
        modalDesc="Are you sure you want to cancel the rating?"
        type="Warning"
      />
    </Container>
  )
}

export default RatingList
