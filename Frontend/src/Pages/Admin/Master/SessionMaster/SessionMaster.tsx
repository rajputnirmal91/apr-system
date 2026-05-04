import { useCallback, useEffect, useState } from 'react'

import { Col, Container, Form, Modal, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useDispatch } from 'react-redux'
import moment from 'moment'

import Calendar from '@project/assets/images/Calendar.svg'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import DeleteBlackIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import Line from '@project/assets/images/Line.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import GenericTable, {
  ColumnDef,
} from '@project/Components/GenericTable/GenericTable'
import CustomModal from '@project/Components/Modal/Modal'
import CustomPagination from '@project/Components/Pagination/Pagination'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useAddSessionMutation,
  useCheckDuplicateSessionNameMutation,
  useDeleteSessionMutation,
  useGetSessionListQuery,
  useUpdateSessionMutation,
} from '@project/Store/Api/Admin/SessionMaster/sessionMasterApi'
import commonApi, {
  useGetSessionsQuery,
} from '@project/Store/Api/Common/commonApi'
import { AppDispatch } from '@project/Store/store'
import { SessionItem } from '@project/Types/sessionTypes'
import useDebounce from '@project/Utils/debounce'
import { showSuccessToast } from '@project/Utils/notificationPopup'
import findOverlappingSessions from '@project/Utils/sessionUtils'

import 'react-datepicker/dist/react-datepicker.css'
import './SessionMaster.scss'

function SessionMaster() {
  const [errors, setErrors] = useState<{
    session_name?: string
    start_date?: string
    end_date?: string
  }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 500)
  const [editData, setEditData] = useState<SessionItem | null>(null)
  const [modalShow, setModalShow] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')

  // Add Session Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [editSessionId, setEditSessionId] = useState<string>('')
  const [sessionName, setSessionName] = useState<string>('')
  const [isPresentSession, setIsPresentSession] = useState<boolean>(false)
  const [sessionStartDate, setSessionStartDate] = useState<string>('')
  const [sessionEndDate, setSessionEndDate] = useState<string>('')

  // Present session confirmation dialog
  const [showPresentSessionModal, setShowPresentSessionModal] =
    useState<boolean>(false)
  const [presentSessionModalMsg, setPresentSessionModalMsg] =
    useState<string>('')
  const [pendingCheckValue, setPendingCheckValue] = useState<boolean>(false)

  const { data, refetch } = useGetSessionListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      order_by: 'asc',
      sort_by: 'session',
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const { data: navbarSessionsData } = useGetSessionsQuery()

  useEffect(() => {
    if ((navbarSessionsData?.appraisal_sessions?.length ?? 0) === 0) {
      setShowAddModal(true)
    }
  }, [navbarSessionsData?.appraisal_sessions?.length])

  const dispatch = useDispatch<AppDispatch>()

  const [addSession, { isLoading: isAddingSession }] = useAddSessionMutation()
  const [updateSession, { isLoading: isUpdatingSession }] =
    useUpdateSessionMutation()
  const [deleteSession, { isLoading: isDeletingSession }] =
    useDeleteSessionMutation()

  const [checkDuplicateSession, { isLoading: isDuplicateChecking }] =
    useCheckDuplicateSessionNameMutation()

  const debouncedSessionName = useDebounce(sessionName, 800)

  const runDuplicateNameCheck = useCallback(
    async (name: string) => {
      const normalized = name.trim()
      if (!normalized) return ''

      if (
        editData &&
        normalized.toLowerCase() === editData.session?.trim().toLowerCase()
      ) {
        return ''
      }

      try {
        const res = await checkDuplicateSession({
          session_name: normalized,
          appraisal_session_id: editSessionId || null,
        }).unwrap()

        if (res?.message === 'Duplicate session name found.') {
          return 'This session name is already in use'
        }

        return ''
      } catch (err) {
        console.error('Session name check failed', err)
        return ''
      }
    },
    [checkDuplicateSession, editData, editSessionId]
  )

  useEffect(() => {
    if (!debouncedSessionName?.trim()) return

    const validateDuplicate = async () => {
      const duplicateError = await runDuplicateNameCheck(debouncedSessionName)
      setErrors((prev) => ({
        ...prev,
        session_name: duplicateError,
      }))
    }

    validateDuplicate()
  }, [debouncedSessionName, runDuplicateNameCheck])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const resetForm = () => {
    setSessionName('')
    setIsPresentSession(false)
    setSessionStartDate('')
    setSessionEndDate('')
    setIsEditMode(false)
    setEditSessionId('')
    setErrors({})
  }

  const handleEditData = (item: SessionItem) => {
    setEditData(item)
    setIsEditMode(true)
    setEditSessionId(item.appraisal_session_id)
    setSessionName(item.session)
    setIsPresentSession(item.is_present_session)
    setSessionStartDate(item.session_start_date)
    setSessionEndDate(item.session_end_date)
    setShowAddModal(true)
  }

  const handleDeletePopUpOpen = (id: string) => {
    setModalShow(true)
    setDeleteId(id)
  }

  const handleDeletePopUpClose = () => {
    setModalShow(false)
  }

  const handleDelete = async () => {
    if (isDeletingSession) return
    await deleteSession({ session_id: deleteId }).unwrap()
    showSuccessToast('Session deleted successfully')
    handleDeletePopUpClose()
    dispatch(commonApi.util.invalidateTags(['Sessions']))
    setTimeout(() => {
      refetch()
    }, 100)
  }

  const handleAddSessionOpen = () => {
    setIsEditMode(false)
    setEditSessionId('')
    setShowAddModal(true)
  }

  const handlePresentSessionChange = (checked: boolean) => {
    if (checked) {
      // Checking: warn that other sessions will be unmarked
      setPresentSessionModalMsg(
        'This will mark the current session as present and unmark any other session that was previously present.'
      )
      setPendingCheckValue(true)
      setShowPresentSessionModal(true)
    } else if (isEditMode && editData?.is_present_session) {
      // Unchecking in edit mode when this session WAS the present session
      setPresentSessionModalMsg(
        'There will be no present session if you uncheck this.'
      )
      setPendingCheckValue(false)
      setShowPresentSessionModal(true)
    } else {
      // Unchecking in add mode - no warning needed
      setIsPresentSession(false)
    }
  }

  const handlePresentSessionConfirm = () => {
    setIsPresentSession(pendingCheckValue)
    setShowPresentSessionModal(false)
  }

  const handlePresentSessionCancel = () => {
    setShowPresentSessionModal(false)
    // Don't change the checkbox value
  }

  type DateFieldType = 'start' | 'end'

  const handleDateChange = (date: Date | null, type: DateFieldType) => {
    const formattedDate = date ? moment(date).format('YYYY-MM-DD') : ''

    // Update state
    if (type === 'start') {
      setSessionStartDate(formattedDate)
    } else {
      setSessionEndDate(formattedDate)
    }

    setErrors((prev) => {
      const newErrors = { ...prev }

      const startDate = type === 'start' ? formattedDate : sessionStartDate
      const endDate = type === 'end' ? formattedDate : sessionEndDate

      // ---------- RANGE VALIDATION ----------
      if (startDate && endDate && moment(startDate).isAfter(moment(endDate))) {
        if (type === 'start') {
          newErrors.start_date = 'Start date cannot be after end date'
          delete newErrors.end_date
        } else {
          newErrors.end_date = 'End date cannot be before start date'
          delete newErrors.start_date
        }

        return newErrors
      }

      // ---------- OVERLAP VALIDATION ----------
      if (startDate && endDate) {
        const overlaps = findOverlappingSessions(
          new Date(startDate),
          new Date(endDate),
          data?.appraisal_sessions || [],
          editData?.appraisal_session_id
        )

        if (overlaps.length === 1) {
          newErrors.end_date = `Selected dates overlap with session (${overlaps[0].session_start_date} - ${overlaps[0].session_end_date})`
        } else if (overlaps.length > 1) {
          newErrors.end_date = 'Selected dates overlap with multiple sessions'
        } else {
          delete newErrors.end_date
        }
      }

      return newErrors
    })
  }

  const validateSessionForm = () => {
    const newErrors: {
      session_name?: string
      start_date?: string
      end_date?: string
    } = {}

    const trimmedName = sessionName.trim()

    if (!trimmedName) {
      newErrors.session_name = 'Session name is required'
    } else if (trimmedName.length > 50) {
      newErrors.session_name = 'Maximum 50 characters allowed'
    }

    if (!sessionStartDate) {
      newErrors.start_date = 'Start date is required'
    }

    if (!sessionEndDate) {
      newErrors.end_date = 'End date is required'
    }

    if (
      sessionStartDate &&
      sessionEndDate &&
      moment(sessionStartDate).isAfter(moment(sessionEndDate))
    ) {
      newErrors.start_date = 'Start date cannot be after end date'
    }

    if (sessionStartDate && sessionEndDate) {
      const overlaps = findOverlappingSessions(
        new Date(sessionStartDate),
        new Date(sessionEndDate),
        data?.appraisal_sessions || [],
        editSessionId
      )

      if (overlaps.length === 1) {
        newErrors.end_date = `Selected dates overlap with session (${overlaps[0].session_start_date} - ${overlaps[0].session_end_date})`
      }

      if (overlaps.length > 1) {
        newErrors.end_date = 'Selected dates overlap with multiple sessions'
      }
    }

    return newErrors
  }

  const hasErrors = (formErrors: {
    session_name?: string
    start_date?: string
    end_date?: string
  }) => Object.values(formErrors).some(Boolean)

  const isSaveDisabled =
    isAddingSession ||
    isUpdatingSession ||
    isDuplicateChecking ||
    hasErrors(errors) ||
    !sessionName.trim() ||
    !sessionStartDate ||
    !sessionEndDate

  const handleAddSessionClose = () => {
    setShowAddModal(false)
  }

  const handleCancelConfirm = () => {
    resetForm()
    setShowCancelModal(false)
    setShowAddModal(false)
  }

  const handleSaveSession = async () => {
    const baseErrors = validateSessionForm()
    setErrors(baseErrors)

    if (hasErrors(baseErrors)) {
      return
    }

    const duplicateError = await runDuplicateNameCheck(sessionName)
    if (duplicateError) {
      setErrors((prev) => ({
        ...prev,
        session_name: duplicateError,
      }))
      return
    }

    const payload = {
      session: sessionName.trim(),
      is_present_session: isPresentSession || data?.total_count === 0,
      session_start_date: sessionStartDate,
      session_end_date: sessionEndDate,
    }

    if (isEditMode) {
      await updateSession({
        ...payload,
        appraisal_session_id: editSessionId,
      }).unwrap()
    } else {
      await addSession(payload).unwrap()
    }
    refetch()
    dispatch(commonApi.util.invalidateTags(['Sessions']))
    handleAddSessionClose()
    resetForm()
  }

  const parseSessionDate = (value: string): Date | null => {
    if (!value) return null

    const strictParsed = moment(
      value,
      [
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mm:ss',
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
        'MMM DD, YYYY',
        'MMM D, YYYY',
      ],
      true
    )

    if (strictParsed.isValid()) {
      return strictParsed.toDate()
    }

    const fallbackParsed = moment(value)
    return fallbackParsed.isValid() ? fallbackParsed.toDate() : null
  }

  const parsedStartDate = parseSessionDate(sessionStartDate)
  const parsedEndDate = parseSessionDate(sessionEndDate)

  const startDateExclusionIntervals = parsedEndDate
    ? [
        {
          start: moment(parsedEndDate).add(1, 'day').startOf('day').toDate(),
          end: moment('2100-12-31').toDate(),
        },
      ]
    : undefined

  const endDateExclusionIntervals = parsedStartDate
    ? [
        {
          start: moment('1900-01-01').toDate(),
          end: moment(parsedStartDate).subtract(1, 'day').endOf('day').toDate(),
        },
      ]
    : undefined

  const isStartDateSelectable = (date: Date) =>
    !parsedEndDate || !moment(date).isAfter(parsedEndDate, 'day')

  const isEndDateSelectable = (date: Date) =>
    !parsedStartDate || !moment(date).isBefore(parsedStartDate, 'day')

  return (
    <>
      <CustomModal
        show={modalShow}
        onClose={handleDeletePopUpClose}
        onConfirm={handleDelete}
        image={DeleteWhiteIcon}
        modalHeading="Delete Session"
        modalDesc="Do you want to delete this session?"
        type="Warning"
        loading={isDeletingSession}
      />
      <CustomModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        image={CloseWhiteIcon}
        modalHeading="Cancel Session"
        modalDesc="Are you sure you want to cancel adding the session?"
        type="Warning"
      />
      <CustomModal
        show={showPresentSessionModal}
        onClose={handlePresentSessionCancel}
        onConfirm={handlePresentSessionConfirm}
        image={CloseWhiteIcon}
        modalHeading="Present Session"
        modalDesc={presentSessionModalMsg}
        type="Warning"
      />
      <Container fluid className="sessionMasterPage">
        <TopSearch
          title="Session Master"
          searchPlaceholder="Search"
          searchValue={search}
          buttonLabel="Add Session"
          buttonToggledLabel="Cancel"
          onSearchChange={(value) => handleSearch(value)}
          onToggle={handleAddSessionOpen}
        />
        {(() => {
          const columns: ColumnDef<SessionItem>[] = [
            { key: 's_no', header: 'S.No' },
            { key: 'session', header: 'Session' },
            { key: 'active_session', header: 'Active Session' },
            { key: 'session_start_date', header: 'Start Date' },
            { key: 'session_end_date', header: 'End Date' },
            { key: 'action', header: 'Action' },
          ]
          return (
            <div className="commonTable">
              <GenericTable<SessionItem>
                columns={columns}
                data={data?.appraisal_sessions ?? []}
                keyExtractor={(item) => item.appraisal_session_id}
                emptyState={{
                  heading: 'No sessions found',
                  description:
                    'Currently, no sessions are available. Please add a session.',
                }}
                renderRow={(item, index) => (
                  <tr
                    key={item.appraisal_session_id}
                    className={`custom-row${item.is_present_session ? ' present-session-row' : ''}`}
                  >
                    <td className="custom-td font14 font400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="custom-td font14 font400">
                      {item.session || '-'}
                    </td>
                    <td className="custom-td font14 font400">
                      {item.is_present_session ? 'Yes' : 'No'}
                    </td>
                    <td className="custom-td font14 font400">
                      {item.session_start_date}
                    </td>
                    <td className="custom-td font14 font400">
                      {item.session_end_date}
                    </td>
                    <td className="custom-td font14 font400">
                      <div className="d-flex gap-3">
                        <button
                          className="transparentButton"
                          onClick={() => handleEditData(item)}
                          disabled={item?.is_form_published}
                        >
                          <img src={EditIcon} alt="editIcon" />
                        </button>
                        <img src={Line} alt="line" />
                        <button
                          className="transparentButton"
                          onClick={() =>
                            handleDeletePopUpOpen(item.appraisal_session_id)
                          }
                          disabled={item?.is_associated}
                          title={
                            item?.is_associated
                              ? 'Session is associated with an appraisal form'
                              : item?.is_form_published
                                ? 'Session is associated with a published appraisal form'
                                : 'Delete Session'
                          }
                        >
                          <img src={DeleteBlackIcon} alt="deleteIcon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            </div>
          )
        })()}
        {data?.appraisal_sessions && data.appraisal_sessions.length > 0 && (
          <CustomPagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalRows={data?.total_count || 0}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        {/* Add Session Modal */}
        <Modal
          show={showAddModal}
          onHide={() => setShowCancelModal(true)}
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
                  {isEditMode ? 'Edit Session' : 'Add Session'}
                </h3>
              </div>
            </Col>
            <Col className="whiteBg addGoal p-4">
              <Row className="mb-3">
                <Col lg={12}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label font14 font400 fontOnest mb-0">
                      Session Name <span className="text-danger">*</span>
                    </label>
                    <span className="font12 font400 fontOnest">
                      {sessionName.length}/50
                    </span>
                  </div>
                  <CommonInput
                    placeholder="e.g., 2032-2033"
                    value={sessionName}
                    onChange={(e) => {
                      if (e.target.value.length > 50) {
                        setErrors((prev) => ({
                          ...prev,
                          session_name: 'Maximum 50 characters allowed',
                        }))
                        return
                      }
                      setSessionName(e.target.value)
                      setErrors((prev) => ({
                        ...prev,
                        session_name: '',
                      }))
                    }}
                    width="100%"
                  />

                  {errors.session_name && (
                    <div
                      className="text-danger"
                      style={{ fontSize: '12px', marginTop: '4px' }}
                    >
                      {errors.session_name}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg={12}>
                  <Form.Check
                    type="checkbox"
                    id="is-present-session"
                    label="Is Active Session"
                    checked={isPresentSession || data?.total_count === 0}
                    onChange={(e) =>
                      handlePresentSessionChange(e.target.checked)
                    }
                    className="custom-checkbox"
                    disabled={
                      isPresentSession ||
                      data?.total_count === 0 ||
                      (data?.total_count === 1 && isEditMode) // Disable if it's the only session and we're not editing
                    }
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg={12}>
                  <label className="form-label font14 font400 fontOnest">
                    Session Start Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={parsedStartDate}
                    onChange={(date) => handleDateChange(date, 'start')}
                    startDate={parsedStartDate}
                    endDate={parsedEndDate}
                    selectsStart
                    maxDate={parsedEndDate ?? undefined}
                    filterDate={isStartDateSelectable}
                    excludeDateIntervals={startDateExclusionIntervals}
                    dateFormat="MMM dd, yyyy"
                    placeholderText="Select start date"
                    onKeyDown={(e) => e.preventDefault()}
                    className="form-control"
                    icon={
                      <img
                        src={Calendar}
                        alt="calendar"
                        className="calendar-icon"
                      />
                    }
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                  />
                  {errors.start_date && (
                    <div
                      className="text-danger"
                      style={{ fontSize: '12px', marginTop: '4px' }}
                    >
                      {errors.start_date}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg={12}>
                  <label className="form-label font14 font400 fontOnest">
                    Session End Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={parsedEndDate}
                    onChange={(date) => handleDateChange(date, 'end')}
                    startDate={parsedStartDate}
                    endDate={parsedEndDate}
                    selectsEnd
                    minDate={parsedStartDate ?? undefined}
                    filterDate={isEndDateSelectable}
                    excludeDateIntervals={endDateExclusionIntervals}
                    dateFormat="MMM dd, yyyy"
                    placeholderText="Select end date"
                    onKeyDown={(e) => e.preventDefault()}
                    className="form-control"
                    icon={
                      <img
                        src={Calendar}
                        alt="calendar"
                        className="calendar-icon"
                      />
                    }
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    scrollableYearDropdown
                    yearDropdownItemNumber={20}
                  />
                  {errors.end_date && (
                    <div
                      className="text-danger"
                      style={{ fontSize: '12px', marginTop: '4px' }}
                    >
                      {errors.end_date}
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
            <Modal.Footer className="border-0 justify-content-start">
              {(data?.total_count ?? 0) > 0 && (
                <SharedButton
                  label="Cancel"
                  variant="outline"
                  onClick={() => setShowCancelModal(true)}
                />
              )}
              <SharedButton
                label={
                  isAddingSession || isUpdatingSession ? 'Saving...' : 'Save'
                }
                onClick={handleSaveSession}
                disabled={isSaveDisabled}
              />
            </Modal.Footer>
          </Row>
        </Modal>
      </Container>
    </>
  )
}

export default SessionMaster
