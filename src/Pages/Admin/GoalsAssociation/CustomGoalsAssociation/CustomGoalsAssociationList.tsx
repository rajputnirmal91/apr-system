/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react'

import { Accordion, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import DownArrow from '@project/assets/images/DownArrow.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import GoalNotFound from '@project/assets/images/noRecordImg.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import CustomModal from '@project/Components/Modal/Modal'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import {
  useGetGoalsAssociationListQuery,
  useGetOwnerMasterListQuery,
  useLazyGetCustomEyeViewDetailsQuery,
} from '@project/Store/Api/Admin/GoalsAssociation'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { RootState } from '@project/Store/store'
import useDebounce from '@project/Utils/debounce'
import { showErrorToast } from '@project/Utils/notificationPopup'

import GoalsAssociationForm from '../GobalGoalsAssociation/GoalsAssociationForm'

import CustomAssociationComplete from './CustomAssociationComplete'
import CustomGoalsAssociationForm from './CustomGoalsAssociationForm'
import CustomGoalsAssociationTableList from './CustomGoalsAssociationTableList'

import '../GoalsAssociation.scss'
import './CustomGoalsAssociation.scss'

export default function CustomGoalsAssociationList(): JSX.Element {
  const [selectedDesignation, setSelectedDesignation] = useState<any>('')
  const [globalSearch, setGlobalSearch] = useState<string>('')
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [goals, setGoals] = useState<any[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [editDesignationId, setEditDesignationId] = useState<number | null>(
    null
  )
  const [editGoals, setEditGoals] = useState<any[]>([])
  const [isAssociate, setIsAssociate] = useState(false)
  const [selectedOwnerById, setSelectedOwnerById] = useState<
    Record<number, number>
  >({})
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [readableMode, setReadableMode] = useState<Record<number, boolean>>({})
  const [editExpandedId, setEditExpandedId] = useState<number | null>(null)
  const [selectedDesignationLabel, setSelectedDesignationLabel] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [deleteGoal, setDeleteGoal] = useState<any>(null)
  const editUnsavedChangesRef = useRef<Record<number, boolean>>({})
  const [collapseRequestId, setCollapseRequestId] = useState<number | null>(
    null
  )
  const [editCollapseRequestId, setEditCollapseRequestId] = useState<
    number | null
  >(null)
  // Track unsaved state reported by the active GoalsAssociationForm
  const [formHasUnsaved, setFormHasUnsaved] = useState(false)
  const [disableReviewer, setDisableReviewer] = useState<Set<number>>(new Set())

  const dispatch = useDispatch()
  const debouncedSearch = useDebounce(globalSearch, 500)

  //  API now depends on designation
  const { data: goalsData, refetch } = useGetGoalsAssociationListQuery(
    {
      goal_type: 0,
      search: debouncedSearch,
      designation: selectedDesignation,
    },
    { skip: !selectedDesignation }
  )

  const [getGoalsAssociationList, { data: goalsDataNew }] =
    useLazyGetCustomEyeViewDetailsQuery()

  const { data: ownerOptionsData } = useGetOwnerMasterListQuery()

  const ownerOptions = useMemo(() => {
    return (
      ownerOptionsData?.Owners?.map((owner: { id: number; owner: string }) => ({
        label: owner.owner,
        value: owner.id,
      })) ?? []
    )
  }, [ownerOptionsData])

  useEffect(() => {
    if (goalsData?.Goals) {
      setGoals(goalsData.Goals)
    }
  }, [goalsData])

  //  NEW: Static delete handler
  const handleDelete = (goalId: number) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.goal_id !== goalId))
  }

  const handleTableEdit = (row: any) => {
    setSelectedDesignation(String(row.designation_id))
    setSelectedDesignationLabel(row.designation)

    setEditDesignationId(row.designation_id)
    setIsAssociate(true)
    setShowDetails(false)

    getGoalsAssociationList({
      goal_type: 0,
      search: debouncedSearch,
      designation: row.designation_id,
    })
  }

  const toggleExpand = (id: number) => {
    const ownerId = selectedOwnerById[id]

    if (!ownerId) {
      showErrorToast('Please Select Reviewers first')
      return
    }

    const isCurrentlyOpen = expandedId === id
    const goal = goals.find((g) => g.goal_id === id)

    setReadableMode((prev) => ({
      ...prev,
      [id]: goal?.status === 'Complete',
    }))

    const opening = !isCurrentlyOpen
    setExpandedId(opening ? id : null)
    // Mark as unsaved whenever an accordion opens so the tab-switch guard fires
    dispatch(setUnsavedChanges(opening))
  }

  const handleClick = (goalsdesignationId: any) => {
    getGoalsAssociationList({
      goal_type: 0,
      search: '',
      designation: goalsdesignationId,
    })
    setShowDetails(true)
  }

  const handleAssociateToggle = (next: boolean) => {
    setIsAssociate(next)

    if (!next) {
      setEditDesignationId(null)
      setEditGoals([])
      setEditExpandedId(null)
      setSelectedOwnerById({})
      setSelectedDesignation(null)
    }
  }

  useEffect(() => {
    if (editGoals?.length) {
      const ownerMap: Record<number, number> = {}

      editGoals.forEach((goal: any) => {
        if (goal.owner_id) {
          ownerMap[goal.goal_id] = goal.owner_id
        }
      })

      setSelectedOwnerById(ownerMap)
    }
  }, [editGoals])

  useEffect(() => {
    if (goalsData?.Goals) {
      const initialOwners: Record<number, number> = {}
      goalsData.Goals.forEach((goal: any) => {
        if (goal.owner_id) {
          initialOwners[goal.goal_id] = goal.owner_id
        }
      })
      setSelectedOwnerById(initialOwners)
      setDisableReviewer(new Set())
    }
  }, [goalsData?.Goals])

  useEffect(() => {
    if (goalsDataNew?.Goals && editDesignationId) {
      setEditGoals(goalsDataNew.Goals)
    }
  }, [goalsDataNew, editDesignationId])

  const hasUnsavedChanges = useSelector(
    (state: RootState) => state.unsavedChangesGoalsSlice.hasUnsavedChanges
  )

  return (
    <>
      {/* Always render form  */}
      <CustomGoalsAssociationForm
        selectedDesignation={selectedDesignation}
        selectedDesignationLabel={selectedDesignationLabel}
        setSelectedDesignation={setSelectedDesignation}
        goalsData={goalsData}
        isAssociate={isAssociate}
        setIsAssociate={handleAssociateToggle}
        onSearch={setGlobalSearch}
        formHasUnsaved={formHasUnsaved}
        accordionOpen={expandedId !== null}
        onDesignationConfirm={() => {
          setExpandedId(null)
          setFormHasUnsaved(false)
        }}
      />
      <Container fluid className="p-0 custom-goals-wrap">
        {isAssociate && selectedDesignation && !showDetails && (
          <div className="AccordionWrapperCustomGoals">
            {goals.length === 0 ? (
              <NoRecordFound
                heading="No Custom goals found"
                description="Currently, no Custom goals are available."
                className="centerNoRecord"
              />
            ) : (
              <Accordion activeKey={expandedId ? String(expandedId) : ''} flush>
                {goals.map((goal, index) => {
                  const isOpen = expandedId === goal.goal_id
                  const count = goals?.length - index

                  return (
                    <Accordion.Item
                      eventKey={String(goal.goal_id)}
                      key={goal.goal_id}
                    >
                      <Accordion.Header
                        onClick={() => {
                          toggleExpand(goal.goal_id)
                        }}
                        style={{
                          position: 'relative',
                          zIndex: count,
                        }}
                      >
                        <div className="goal-card responsive-goal-card d-flex align-items-center justify-content-between w-100 border-0">
                          <div className="goal-title">
                            {goal.goal_name} - {goal.goal_weightage}%
                          </div>

                          <div className="goal-controls d-flex align-items-center gap-3">
                            <span className="statusBox">
                              {getStatusIcon(goal.status)}
                              {goal.status}
                            </span>

                            <div className="vr" />

                            <div
                              className="dropdown-wrapper"
                              style={{ maxWidth: 220 }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <SharedDropDown
                                className="goalsHeaderDropDown"
                                placeHolder="Select Reviewers"
                                options={ownerOptions}
                                icon={dropDownArrow}
                                value={selectedOwnerById[goal.goal_id] ?? ''}
                                onChange={(e) => {
                                  setSelectedOwnerById((prev: any) => ({
                                    ...prev,
                                    [goal.goal_id]: e.target.value,
                                  }))

                                  dispatch(setUnsavedChanges(true))
                                }}
                                disabled={
                                  (goal.status === 'Complete' ||
                                    disableReviewer.has(goal.goal_id)) &&
                                  readableMode[goal.goal_id] !== false
                                }
                              />
                            </div>

                            <div className="vr" style={{ opacity: 1 }} />

                            <button
                              type="button"
                              disabled={
                                goal.status !== 'Complete' ||
                                (isOpen && readableMode[goal.goal_id] === false)
                              }
                              onClick={(e) => {
                                e.stopPropagation()
                                setReadableMode((prev) => ({
                                  ...prev,
                                  [goal.goal_id]: false,
                                }))
                                setExpandedId(goal.goal_id)
                              }}
                              className="icon-button customGoalButton"
                            >
                              <img src={EditIcon} alt="edit" />
                            </button>

                            <div className="vr" style={{ opacity: 1 }} />

                            {/* Expand / View */}
                            <button
                              type="button"
                              style={{ display: 'none' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setReadableMode((prev) => ({
                                  ...prev,
                                  [goal.goal_id]: true,
                                }))
                                setExpandedId(isOpen ? null : goal.goal_id)
                              }}
                              className="expand-btn customGoalButton"
                            >
                              <img
                                src={isOpen ? TopArrow : DownArrow}
                                alt={isOpen ? 'collapse' : 'expand'}
                              />
                            </button>
                          </div>
                        </div>
                      </Accordion.Header>

                      <Accordion.Body>
                        {isOpen &&
                          (goal.status === 'Complete' &&
                            readableMode[goal.goal_id] ? (
                            <CustomAssociationComplete
                              goals={[goal]}
                              designation={selectedDesignation}
                              showBreadcrumbs={false}
                              onBack={() => setExpandedId(null)}
                            />
                          ) : (
                            <GoalsAssociationForm
                              goal={goal}
                              editData={goal}
                              ownerId={Number(
                                selectedOwnerById[goal.goal_id] ?? goal.owner_id
                              )}
                              designationId={selectedDesignation}
                              owner_name={
                                ownerOptions.find(
                                  (o) =>
                                    o.value === selectedOwnerById[goal.goal_id]
                                )?.label ?? goal.owner_name
                              }
                              collapseRequestId={collapseRequestId}
                              clearCollapseRequest={() =>
                                setCollapseRequestId(null)
                              }
                              onUnsavedStateChange={setFormHasUnsaved}
                              onSuccess={() => {
                                dispatch(setUnsavedChanges(false))
                                setFormHasUnsaved(false)
                                // Optimistically mark as Complete so disabled state applies immediately
                                setGoals((prev) =>
                                  prev.map((g) =>
                                    g.goal_id === goal.goal_id
                                      ? { ...g, status: 'Complete' }
                                      : g
                                  )
                                )
                                setReadableMode((prev) => ({
                                  ...prev,
                                  [goal.goal_id]: true,
                                }))
                                refetch()
                                setExpandedId(null)
                              }}
                              onCancel={() => {
                                dispatch(setUnsavedChanges(false))
                                setFormHasUnsaved(false)
                                setExpandedId(null)
                                setReadableMode((prev) => ({
                                  ...prev,
                                  [goal.goal_id]: true,
                                }))
                              }}
                            />
                          ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                })}
              </Accordion>
            )}
          </div>
        )}

        {!isAssociate &&
          !editDesignationId &&
          (showDetails ? (
            <CustomAssociationComplete
              // @ts-expect-error -- goals prop type mismatch
              goals={goalsDataNew?.Goals}
              designation={selectedDesignation}
              showBreadcrumbs
              onBack={() => setShowDetails(false)}
            />
          ) : (
            <CustomGoalsAssociationTableList
              onView={handleClick}
              onEdit={handleTableEdit}
              search={debouncedSearch}
            />
          ))}

        {/* )}  */}
      </Container>

      {!isAssociate && editDesignationId && !showDetails && (
        <div className="mt-3">
          {editGoals?.length > 0 ? (
            <Accordion
              activeKey={editExpandedId ? String(editExpandedId) : ''}
              flush
            >
              {editGoals.map((goal, index) => {
                const isOpen = editExpandedId === goal.goal_id
                const count = editGoals?.length - index
                return (
                  <Accordion.Item
                    eventKey={String(goal.goal_id)}
                    key={`edit-goal-${goal.goal_id}`}
                  >
                    <Accordion.Header>
                      <div
                        className="goal-card responsive-goal-card d-flex align-items-center justify-content-between w-100 border-0"
                        style={{
                          position: 'relative',
                          zIndex: count,
                        }}
                      >
                        <div className="fw-semibold">
                          {goal.goal_name} – {goal.goal_weightage}%
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          {/* Status */}
                          <span className="statusBox d-flex align-items-center gap-1">
                            {getStatusIcon(goal.status)}
                            {goal.status}
                          </span>

                          <div className="vr" />

                          {/* ===== OWNER DROPDOWN ===== */}

                          <div
                            className="dropdown-wrapper"
                            style={{ maxWidth: 220 }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <SharedDropDown
                              className="goalsHeaderDropDown"
                              placeHolder="Select Reviewers"
                              options={ownerOptions}
                              icon={dropDownArrow}
                              value={selectedOwnerById[goal.goal_id]}
                              onChange={(e) => {
                                setSelectedOwnerById((prev: any) => ({
                                  ...prev,
                                  [goal.goal_id]: e.target.value,
                                }))

                                dispatch(setUnsavedChanges(true))
                              }}
                            />
                          </div>

                          <div className="vr" style={{ opacity: 1 }} />

                          {/* Edit */}
                          <button
                            type="button"
                            disabled={goal.status !== 'Complete'}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!selectedOwnerById[goal.goal_id]) {
                                showErrorToast('Please Select Reviewers first')
                                return
                              }

                              setReadableMode((prev) => ({
                                ...prev,
                                [goal.goal_id]: false,
                              }))

                              setEditExpandedId((prev) => {
                                const isCurrentlyOpen = prev === goal.goal_id

                                if (isCurrentlyOpen && hasUnsavedChanges) {
                                  setEditCollapseRequestId(goal.goal_id)
                                  return prev
                                }

                                return isCurrentlyOpen ? null : goal.goal_id
                              })
                            }}
                            className="icon-button customGoalButton"
                            title="Edit Goal Association"
                          >
                            <img src={EditIcon} alt="edit" />
                          </button>

                          <div className="vr" style={{ opacity: 1 }} />

                          {/* Expand / View */}
                          <button
                            type="button"
                            style={{ display: 'none' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!selectedOwnerById[goal.goal_id]) {
                                showErrorToast('Please Select Reviewers first')
                                return
                              }

                              setReadableMode((prev) => ({
                                ...prev,
                                [goal.goal_id]: true,
                              }))

                              setEditExpandedId((prev) => {
                                const isCurrentlyOpen = prev === goal.goal_id
                                const hasUnsaved =
                                  editUnsavedChangesRef.current[goal.goal_id]

                                if (isCurrentlyOpen && hasUnsaved) {
                                  setEditCollapseRequestId(goal.goal_id)
                                  return prev
                                }

                                return isCurrentlyOpen ? null : goal.goal_id
                              })
                            }}
                            className="expand-btn customGoalButton"
                            title="View Goal Association"
                          >
                            <img
                              src={isOpen ? TopArrow : DownArrow}
                              alt={isOpen ? 'collapse' : 'expand'}
                            />
                          </button>
                        </div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      {isOpen && (
                        <GoalsAssociationForm
                          goal={goal}
                          editData={goal}
                          ownerId={Number(
                            selectedOwnerById[goal.goal_id] ?? goal.owner_id
                          )}
                          designationId={selectedDesignation}
                          owner_name={
                            ownerOptions.find(
                              (o) => o.value === selectedOwnerById[goal.goal_id]
                            )?.label ?? goal.owner_name
                          }
                          collapseRequestId={editCollapseRequestId}
                          clearCollapseRequest={() =>
                            setEditCollapseRequestId(null)
                          }
                          onUnsavedStateChange={setFormHasUnsaved}
                          onSuccess={() => {
                            dispatch(setUnsavedChanges(false))
                            setFormHasUnsaved(false)
                            setReadableMode((prev) => ({
                              ...prev,
                              [goal.goal_id]: true,
                            }))
                            refetch()
                            setEditDesignationId(null)
                            setEditGoals([])
                            setEditExpandedId(null)
                          }}
                          onCancel={() => {
                            dispatch(setUnsavedChanges(false))
                            setFormHasUnsaved(false)
                            editUnsavedChangesRef.current[goal.goal_id] = false
                            setEditExpandedId(null)
                          }}
                        />
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })}
            </Accordion>
          ) : (
            <div className="text-center mt-5">
              <img src={GoalNotFound} alt="No goals" />
            </div>
          )}
        </div>
      )}

      <CustomModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setDeleteGoal(null)
        }}
        onConfirm={() => {
          if (!deleteGoal) return

          handleDelete(deleteGoal.goal_id)
          setShowModal(false)
          setDeleteGoal(null)
        }}
        image={DeleteWhiteIcon}
        type="Warning"
        modalHeading="Are you sure want to delete this goal"
        modalDesc="Deleting a goal will also remove its associated KRAs and Secondary-KRAs. Do you want to proceed?"
        mode="confirm"
      />
    </>
  )
}
