import { useEffect, useRef, useState } from 'react'

import { Accordion, Container } from 'react-bootstrap'
import { FaCheckCircle, FaExclamationCircle, FaFileAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import DownArrow from '@project/assets/images/DownArrow.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import TopArrow from '@project/assets/images/TopArrow.svg'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useGetGoalsAssociationListQuery,
  useGetOwnerMasterListQuery,
} from '@project/Store/Api/Admin/GoalsAssociation'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { RootState } from '@project/Store/store'
import useDebounce from '@project/Utils/debounce'
import { showErrorToast } from '@project/Utils/notificationPopup'

import GoalsAssociationComplete from '../GoalsAssociationComplete'

import GoalsAssociationForm from './GoalsAssociationForm'

import '../GoalsAssociation.scss'

type OwnerApi = {
  id: number
  owner: string
}

export default function GlobalGoalsAssociationList(): JSX.Element {
  // -----------------------
  // Local UI state (typed)
  // -----------------------
  const [selectedOwnerById, setSelectedOwnerById] = useState<
    Record<number, string | number>
  >({})
  const initialOwnerByIdRef = useRef<Record<number, string | number>>({})

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [readableMode, setReadableMode] = useState<Record<number, boolean>>({})
  const [globalSearch, setGlobalSearch] = useState<string>('')
  const debouncedSearch = useDebounce(globalSearch, 500)
  const [collapseRequestId, setCollapseRequestId] = useState<number | null>(
    null
  )
  // Track unsaved state reported by the active GoalsAssociationForm
  const [, setFormHasUnsaved] = useState(false)
  // Optimistic complete status before refetch resolves
  const [optimisticCompleteIds, setOptimisticCompleteIds] = useState<
    Set<number>
  >(new Set())
  const dispatch = useDispatch()

  // -----------------------
  // API calls
  // -----------------------

  const { data: goalsData, refetch } = useGetGoalsAssociationListQuery({
    goal_type: 1,
    search: debouncedSearch,
  })

  const goals = goalsData?.Goals ?? []
  const hasNoRecords = goals.length === 0

  const { data: ownerOptionsData } = useGetOwnerMasterListQuery()
  const ownerOptions =
    ownerOptionsData?.Owners?.map((owner: OwnerApi) => ({
      label: owner.owner,
      value: owner.id,
    })) ?? []

  const hasUnsavedChanges = useSelector(
    (state: RootState) => state.unsavedChangesGoalsSlice.hasUnsavedChanges
  )

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
  }

  useEffect(() => {
    if (goalsData?.Goals) {
      const initialOwners: Record<number, string | number> = {}
      goalsData.Goals.forEach((goal) => {
        if (goal.owner_id) {
          initialOwners[goal.goal_id] = goal.owner_id
        }
      })
      initialOwnerByIdRef.current = initialOwners
      setSelectedOwnerById(initialOwners)
      // Fresh data arrived — clear optimistic overrides
      setOptimisticCompleteIds(new Set())
    }
  }, [goalsData?.Goals])

  // -----------------------
  // Rendering
  // -----------------------
  return (
    <Container fluid className="p-0 AccordionWrapper">
      <div className="top-search-wrapper">
        <TopSearch
          title="Global Goals"
          searchValue={globalSearch}
          onSearchChange={(value) => setGlobalSearch(value)}
          showButton={false}
          disabled={
            hasUnsavedChanges === true ||
            expandedId !== null ||
            (hasNoRecords && globalSearch.trim() === '')
          }
          searchPlaceholder="Search Global Goals"
        />
      </div>

      {goalsData?.is_form_published && goals.length > 0 && (
        <div className="d-flex justify-content-end">
          <p className="form-published-warning font16">
            Status: Form Published — Editing restricted
          </p>
        </div>
      )}
      <div className="GoalListWrapper">
        {goals?.length > 0 ? (
          <Accordion
            className="goalsAssociatonAcordion"
            activeKey={expandedId ? String(expandedId) : ''}
          >
            {goals.map((goal) => {
              const isOpen = expandedId === goal.goal_id

              const statusConfig: Record<
                string,
                { icon: React.ElementType; color: string; label: string }
              > = {
                Complete: {
                  icon: FaCheckCircle,
                  color: '#27B407',
                  label: 'Complete',
                },
                Draft: {
                  icon: FaFileAlt,
                  color: '#0022FF',
                  label: 'Draft',
                },
                Pending: {
                  icon: FaExclamationCircle,
                  color: '#FF8800',
                  label: 'Pending',
                },
              }

              const currentStatus = goal.status || 'Pending'
              const statusDetails =
                statusConfig[currentStatus as keyof typeof statusConfig] ||
                statusConfig.Pending

              const { icon: Icon, color, label } = statusDetails

              const statusEl = (
                <span className="statusBox">
                  <Icon color={color} style={{ marginTop: '-3px' }} />{' '}
                  <span>{label}</span>
                </span>
              )

              const showCompleteView =
                currentStatus === 'Complete' && readableMode[goal.goal_id]

              return (
                <Accordion.Item
                  key={`goal-kra-association-${goal.goal_id}`}
                  eventKey={String(goal.goal_id)}
                >
                  {/* ---------- HEADER ---------- */}
                  <Accordion.Header
                    onClick={() => {
                      toggleExpand(goal.goal_id)
                    }}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="goal-card responsive-goal-card d-flex align-items-center justify-content-between"
                      style={{ width: '100%', border: 'none' }}
                    >
                      <div className="goal-title">
                        {goal.goal_name} - {goal.goal_weightage}%
                      </div>

                      <div className="goal-controls d-flex align-items-center gap-3">
                        <div className="goal-status d-flex align-items-center gap-2">
                          {statusEl}
                        </div>

                        <div className="vr" />

                        {/* Reviewer Dropdown */}
                        <div
                          className="dropdown-wrapper"
                          style={{
                            maxWidth: 220,
                            cursor:
                              goal.status === 'Complete'
                                ? 'not-allowed'
                                : 'pointer',
                          }}
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
                              setSelectedOwnerById((prev) => ({
                                ...prev,
                                [goal.goal_id]: e.target.value,
                              }))

                              dispatch(setUnsavedChanges(true))
                            }}
                            disabled={
                              (goal.status === 'Complete' ||
                                optimisticCompleteIds.has(goal.goal_id)) &&
                              readableMode[goal.goal_id] !== false
                            }
                          />
                        </div>

                        <div className="vr" />

                        {/* Edit Button */}
                        <button
                          type="button"
                          className="icon-button"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                          }}
                          disabled={
                            goalsData?.is_form_published ||
                            (currentStatus !== 'Complete' &&
                              !optimisticCompleteIds.has(goal.goal_id)) ||
                            (isOpen && readableMode[goal.goal_id] === false)
                          }
                          title="Edit Goal Association"
                          onClick={(e) => {
                            e.stopPropagation()
                            setReadableMode((prev) => ({
                              ...prev,
                              [goal.goal_id]: false,
                            }))
                            setExpandedId(goal.goal_id)
                          }}
                        >
                          <img src={EditIcon} alt="edit" />
                        </button>

                        <div className="vr" />

                        {/* Expand / Collapse Arrow */}
                        <button
                          type="button"
                          className="expand-btn"
                          style={{ display: 'none' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setReadableMode((prev) => ({
                              ...prev,
                              [goal.goal_id]: true,
                            }))
                            setExpandedId(isOpen ? null : goal.goal_id)
                          }}
                        >
                          <img
                            src={isOpen ? TopArrow : DownArrow}
                            alt={isOpen ? 'collapse' : 'expand'}
                          />
                        </button>
                      </div>
                    </div>
                  </Accordion.Header>

                  {/* ---------- BODY ---------- */}
                  <Accordion.Body>
                    {showCompleteView ? (
                      <GoalsAssociationComplete
                        goal={goal}
                        showBreadcrumbs={false}
                      />
                    ) : (
                      <GoalsAssociationForm
                        key={`form-${goal.goal_id}-${expandedId === goal.goal_id ? 'open' : 'closed'}`}
                        goal={goal}
                        editData={goal}
                        ownerId={Number(
                          selectedOwnerById[goal.goal_id] ?? goal.owner_id
                        )}
                        owner_name={
                          ownerOptions.find(
                            (o) => o.value === selectedOwnerById[goal.goal_id]
                          )?.label ?? goal.owner_name
                        }
                        collapseRequestId={collapseRequestId}
                        clearCollapseRequest={() => setCollapseRequestId(null)}
                        onUnsavedStateChange={setFormHasUnsaved}
                        onSuccess={() => {
                          dispatch(setUnsavedChanges(false))
                          setFormHasUnsaved(false)
                          setReadableMode((prev) => ({
                            ...prev,
                            [goal.goal_id]: true,
                          }))
                          setOptimisticCompleteIds((prev) =>
                            new Set(prev).add(goal.goal_id)
                          )
                          refetch()
                          setExpandedId(null)
                        }}
                        onCancel={() => {
                          dispatch(setUnsavedChanges(false))
                          setFormHasUnsaved(false)
                          setSelectedOwnerById({
                            ...initialOwnerByIdRef.current,
                          })
                          setExpandedId(null)
                          setReadableMode((prev) => ({
                            ...prev,
                            [goal.goal_id]: true,
                          }))
                        }}
                      />
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              )
            })}
          </Accordion>
        ) : (
          <NoRecordFound
            heading="No Global goals found"
            description="Currently, no global goals are available."
            className="centerNoRecord"
          />
        )}
      </div>
    </Container>
  )
}
