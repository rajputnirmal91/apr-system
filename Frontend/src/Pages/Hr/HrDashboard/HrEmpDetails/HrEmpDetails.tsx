/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react'

import { Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import chatSquareText from '@project/assets/images/chatSquareText.svg'
import Danger from '@project/assets/images/Danger.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import empDetailsNotFound from '@project/assets/images/empDetailsNotFound.svg'
import profilePic from '@project/assets/images/profilePic.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import CustomModal from '@project/Components/Modal/Modal'
import { useGetPedpRatingQuery } from '@project/Store/Api/Employee/Pedp'
import {
  useGetEmployeePedpDetailsQuery,
  usePublishHrPedpFormMutation,
  useSaveHrPedpFormMutation,
} from '@project/Store/Api/Hr/HrDetailsApi'
import { setUnsavedChanges } from '@project/Store/Feature/UnSavedChangesSlice/UnSavedChangesSlice'
import { RatingType } from '@project/Types/Hr/HrDetailsTypes'
import { showErrorToast } from '@project/Utils/notificationPopup'
import { useUnsavedChangesGuard } from '@project/Utils/useUnsavedChangesGuard'

import './HrEmpDetails.scss'

/* ================= TYPES (ADDED – NO UI IMPACT) ================= */

export type AppraiserInput = {
  appraiser_rating: string
  appraiser_remarks: string
  appraiser_rating_id: string
}

type SavePedpPayload = {
  employee_user_id: string
  form_status: 'Draft' | 'Reviewed'
  goals: {
    goal_associates_sub_kra_id: string
    appraiser_rating_id: string
    appraiser_remarks: string
  }[]
}

export default function HrEmpDetails() {
  /* ========= FIXED: ROW-WISE STATE ========= */
  const [appraiserData, setAppraiserData] = useState<
    Record<string, AppraiserInput>
  >({})
  const [showModal, setShowModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  // Snapshot of appraiserData at the moment edit mode is entered
  const editSnapshotRef = useRef<Record<string, AppraiserInput> | null>(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { employeeUserId } = useParams<{ employeeUserId: string }>()

  /* ================= API CALLS (UNCHANGED) ================= */
  const { data, refetch } = useGetEmployeePedpDetailsQuery(employeeUserId!, {
    skip: !employeeUserId,
    refetchOnMountOrArgChange: true,
  })

  const { data: getRating } = useGetPedpRatingQuery(
    { rating_for: 'Other' },
    { refetchOnMountOrArgChange: true }
  )

  /* ================= MUTATIONS (ADDED) ================= */
  const [saveHrPedpForm] = useSaveHrPedpFormMutation()
  const [publishHrPedpForm] = usePublishHrPedpFormMutation()

  const employee = data?.employee || data

  /* ================= DATA TRANSFORM (UNCHANGED) ================= */
  const transformedGoals =
    data?.employee_pedp_form?.goals?.flatMap((goal: any) =>
      goal.kras.flatMap((kra: any) =>
        kra.sub_kras.map((subKra: any) => ({
          title: goal.goal_name,
          Competency: kra.kra_name,
          description: subKra.sub_kra_name,
          appraiseeRating: subKra.appraisee_rating,
          appraiseeRemarks: subKra.appraisee_remarks,
          id: subKra.goal_associates_sub_kra_id,
        }))
      )
    ) || []

  /* ================= DROPDOWN OPTIONS (UNCHANGED) ================= */
  type RatingOption = {
    label: string
    value: string
    id: string
    remarksRequired: boolean
  }
  const RatingOptions: RatingOption[] =
    getRating?.map((item: RatingType) => ({
      label: String(item.title),
      value: item.title,
      id: item.id,
      remarksRequired: item.is_remarks_mandatory,
    })) || []

  /* ================= VALIDATION ================= */
  const rowErrors = useMemo(() => {
    const errors: Record<string, string> = {}
    transformedGoals.forEach((item: any) => {
      const row = appraiserData[item.id]
      const selectedRating = row?.appraiser_rating || ''
      const remark = row?.appraiser_remarks || ''

      if (!selectedRating) return // rating missing — handled by button disable

      const matchedOption = RatingOptions.find(
        (opt) => opt.value === selectedRating
      )
      const isRemarksMandatory = matchedOption?.remarksRequired === true

      if (isRemarksMandatory && !remark.trim()) {
        errors[item.id] = 'Remark is mandatory'
      }
    })
    return errors
  }, [appraiserData, transformedGoals, RatingOptions])

  const isFormValid = useMemo(() => {
    // Every row must have a rating selected
    const allRatingsSelected = transformedGoals.every(
      (item: any) => !!appraiserData[item.id]?.appraiser_rating
    )
    // No remark errors
    const noRemarkErrors = Object.keys(rowErrors).length === 0
    return allRatingsSelected && noRemarkErrors
  }, [transformedGoals, appraiserData, rowErrors])

  /* ================= ROW HANDLERS (ADDED) ================= */

  const handleRatingChange = (id: string, value: string) => {
    if (!isEdit) return

    const selectedOption = RatingOptions.find((opt) => opt.value === value)

    setAppraiserData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        appraiser_rating: value,
        appraiser_rating_id: selectedOption?.id || '',
      },
    }))
  }

  const handleRemarksChange = (id: string, value: string) => {
    if (!isEdit) return

    setAppraiserData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        appraiser_remarks: value,
      },
    }))
  }

  /* ================= PAYLOAD BUILDER (ADDED) ================= */
  const buildPayload = (status: 'Draft' | 'Reviewed'): SavePedpPayload => ({
    employee_user_id: employeeUserId!,
    form_status: status,
    goals: transformedGoals.map((item: any) => ({
      goal_associates_sub_kra_id: item.id,
      appraiser_rating_id: appraiserData[item.id]?.appraiser_rating_id || '',
      appraiser_remarks: appraiserData[item.id]?.appraiser_remarks || '',
    })),
  })

  /* ================= DIRTY STATE DETECTION ================= */
  // True only when in edit mode AND current data differs from the snapshot taken on edit entry
  const isDirty = useMemo(() => {
    if (!isEdit || !editSnapshotRef.current) return false
    const snapshot = editSnapshotRef.current
    return Object.keys(appraiserData).some((id) => {
      const current = appraiserData[id]
      const original = snapshot[id]
      return (
        current?.appraiser_rating !== original?.appraiser_rating ||
        current?.appraiser_remarks !== original?.appraiser_remarks
      )
    })
  }, [isEdit, appraiserData])

  /* ================= UNSAVED CHANGES GUARD ================= */
  const {
    showModal: showGuardModal,
    handleConfirm: handleGuardConfirm,
    handleClose: handleGuardClose,
  } = useUnsavedChangesGuard({
    hasUnsavedChanges: () => isDirty,
    onConfirmDiscard: () => {
      dispatch(setUnsavedChanges(false))
      setIsEdit(false)
      editSnapshotRef.current = null
    },
  })

  // Keep Redux slice in sync with actual dirty state
  useEffect(() => {
    dispatch(setUnsavedChanges(isDirty))
    return () => {
      dispatch(setUnsavedChanges(false))
    }
  }, [isDirty, dispatch])

  /* ================= SAVE (REAL API) ================= */

  const handleSave = async () => {
    try {
      await saveHrPedpForm(buildPayload('Draft')).unwrap()
      setShowModal(true)
      setIsEdit(false)
      setIsPublished(false)
      editSnapshotRef.current = null
      refetch()
    } catch (error) {
      showErrorToast((error as string) || 'Save failed')
    }
  }

  /* ================= PUBLISH (REAL API) ================= */

  const handlePublish = async () => {
    try {
      await publishHrPedpForm(buildPayload('Reviewed')).unwrap()
      setShowPublishModal(true)
      setIsEdit(false)
      setIsPublished(true)
      editSnapshotRef.current = null
      refetch()
    } catch (error) {
      showErrorToast((error as string) || 'Save failed')
    }
  }

  /* ================= PREFILL APPRAISER DATA FROM API ================= */
  useEffect(() => {
    if (!data?.employee_pedp_form?.goals) return

    const initialState: Record<string, AppraiserInput> = {}
    let hasExistingRatings = false

    data.employee_pedp_form.goals.forEach((goal: any) => {
      goal.kras.forEach((kra: any) => {
        kra.sub_kras.forEach((subKra: any) => {
          initialState[subKra.goal_associates_sub_kra_id] = {
            appraiser_rating: subKra.appraiser_rating || '',
            appraiser_remarks: subKra.appraiser_remarks || '',
            appraiser_rating_id: subKra.appraiser_rating_id || '',
          }
          if (subKra.appraiser_rating) hasExistingRatings = true
        })
      })
    })

    setAppraiserData(initialState)

    // If form already has ratings saved (Draft or Reviewed), start in read mode
    if (hasExistingRatings || data?.form_status === 'Reviewed') {
      setIsEdit(false)
      editSnapshotRef.current = null
      setIsPublished(data?.form_status === 'Reviewed')
    } else {
      // Brand new form — enter edit mode and capture snapshot
      editSnapshotRef.current = { ...initialState }
      setIsEdit(true)
    }
  }, [data])

  return (
    <Container fluid className="p-0 empDetailsMainContainer">
      {/* ── scrollable area ── */}
      <div className="hr-emp-scroll-area">
        <div className="d-flex justify-content-between">
          <button
            onClick={() => navigate('/hr/hr-reviews')}
            className="transparentButton mb-3 d-flex align-items-center"
            data-ignore-guard="true"
          >
            <img src={ArrowLeft} alt="Back" className="me-2" />
            <span className="font14 font400 fontOnest">Back</span>
          </button>
          <div>
            {getStatusIcon(data?.form_status)}
            {data?.form_status}
          </div>
        </div>

        {/* ================= EMPLOYEE DETAILS (UNCHANGED) ================= */}
        <Card className="coreCompetency irmpedpCardBorder employeeDetailsCard irmPedpCard p-0 mb-4">
          <div className="lightBlueBg employeeDetailsCardHeading ">
            <p className="mb-0">Employee details</p>
          </div>

          <div className="p-4 EmployeeDetailsWrapper">
            <Row className="align-items-center ">
              <Col md={2} lg={1}>
                <div className="EmployeeDetailsLeft text-center">
                  <img
                    src={profilePic}
                    alt="profilePic"
                    className="rounded-circle"
                  />
                </div>
              </Col>
              <Col md={10} lg={11}>
                <div className="EmployeeDetailsRight">
                  <div>
                    <p className="mb-0 textLight responsiveFont16">Emp ID</p>
                    <p className="mb-0 font14">
                      {employee?.employee_details?.employee_lms_id}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 font14 textLight responsiveFont16">
                      Emp name
                    </p>
                    <p className="mb-0 font14">
                      {employee?.employee_details?.employee_name}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 font14 textLight responsiveFont16">
                      Current Designation
                    </p>
                    <p className="mb-0 font14">
                      {employee?.employee_details?.employee_current_designation}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 font14 textLight responsiveFont16">
                      Date of Joining
                    </p>
                    <p className="mb-0 font14">
                      {moment(
                        employee?.employee_details?.date_of_joining
                      ).format('MMM DD, YYYY')}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 font14 textLight responsiveFont16">
                      Total IT Experience
                    </p>
                    <p className="mb-0 font14">
                      {employee?.employee_details?.total_it_experience}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0 font14 textLight responsiveFont16">
                      Total LMS Experience
                    </p>
                    <p className="mb-0 font14">
                      {employee?.employee_details?.total_lms_experience}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {data?.employee_pedp_form?.goals?.length > 0 ? (
          <div className="coreCompetencyAccordion HrEmpDetailsBody">
            <div className="accordion">
              {data?.employee_pedp_form?.goals?.map((goal: any) => (
                <div
                  key={goal.goal_id}
                  className="accordion-item irmpedpCardBorder"
                >
                  {/* GOAL HEADER */}
                  <h2 className="accordion-header">
                    <div className="d-flex justify-content-between align-items-center w-100 p-3">
                      <span className="font16">{goal.goal_name}</span>

                      {!isEdit && !isPublished && (
                        <button
                          className="edit-icon transparentButton"
                          onClick={() => {
                            editSnapshotRef.current = { ...appraiserData }
                            setIsEdit(true)
                          }}
                          data-ignore-guard="true"
                        >
                          <img src={EditIcon} alt="editIcon" />
                        </button>
                      )}
                    </div>
                  </h2>

                  {/* GOAL BODY */}
                  <div className="accordion-body ">
                    {goal.kras.map((kra: any) =>
                      kra.sub_kras.map((subKra: any) => {
                        const id = subKra.goal_associates_sub_kra_id

                        return (
                          <div key={id} className="mb-4">
                            {/* KRA */}
                            <div className="pedpDetailsKra p-1 mb-3 ">
                              <p className="mb-0">{kra.kra_name}</p>
                            </div>

                            <Table responsive className="mb-4 equalWidthTable">
                              <thead>
                                <tr>
                                  <th style={{ width: '30%' }}>Seconary Kra</th>
                                  <th style={{ width: '20%' }}>Employee</th>
                                  {/* <th >Remarks by Appraisee</th> */}
                                  <th style={{ width: '25%' }}>Rating by HR</th>
                                  <th style={{ width: '25%' }}>
                                    Remarks by HR
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td
                                    title={subKra.sub_kra_name}
                                    style={{
                                      width: '25%',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {subKra.sub_kra_name}
                                  </td>

                                  {/* <td>{subKra.sub_kra_name}</td> */}
                                  <td style={{ width: '25%' }}>
                                    {subKra.appraisee_rating}{' '}
                                    <img
                                      src={chatSquareText}
                                      alt="chatSquareText"
                                      title={subKra.appraisee_remarks}
                                    />
                                  </td>
                                  {/* <td>{subKra.appraisee_remarks || '-'}</td> */}

                                  {/* HR RATING */}

                                  <td style={{ width: '25%' }}>
                                    {!isEdit ? (
                                      <span>
                                        {appraiserData[id]?.appraiser_rating ||
                                          '-'}
                                      </span>
                                    ) : (
                                      <CustomDropdown
                                        id="rating"
                                        options={RatingOptions}
                                        placeholder="Select rating"
                                        append={document.body}
                                        value={
                                          appraiserData[id]?.appraiser_rating ||
                                          ''
                                        }
                                        disabled={
                                          !isEdit ||
                                          data?.form_status === 'Reviewed'
                                        }
                                        onChange={(e: any) =>
                                          handleRatingChange(id, e.target.value)
                                        }
                                      />
                                    )}
                                  </td>

                                  {/* HR REMARK */}

                                  <td style={{ width: '25%' }}>
                                    {!isEdit ? (
                                      <span>
                                        {appraiserData[id]?.appraiser_remarks ||
                                          '-'}
                                      </span>
                                    ) : (
                                      <>
                                        <Form.Control
                                          as="textarea"
                                          className="textAreaRemark"
                                          rows={1}
                                          placeholder="Write remarks here"
                                          style={{
                                            border: `1px solid ${
                                              rowErrors[id]
                                                ? 'var(--danger)'
                                                : 'var(--border)'
                                            }`,
                                          }}
                                          value={
                                            appraiserData[id]
                                              ?.appraiser_remarks || ''
                                          }
                                          onChange={(e) =>
                                            handleRemarksChange(
                                              id,
                                              e.target.value
                                            )
                                          }
                                          disabled={
                                            !isEdit ||
                                            data?.form_status === 'Reviewed'
                                          }
                                        />

                                        {rowErrors[id] && (
                                          <p className="mb-0 font12 textRed mt-1">
                                            {rowErrors[id]}
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center" style={{ margin: 'auto' }}>
            <img
              src={empDetailsNotFound}
              alt="Details not found"
              style={{ maxWidth: '100%' }}
            />
          </div>
        )}
      </div>
      {/* end hr-emp-scroll-area */}

      {/* ── fixed bottom action bar ── */}
      {data?.employee_pedp_form?.goals?.length > 0 &&
        data?.form_status !== 'Reviewed' && (
          <div className="hr-emp-action-bar d-flex gap-4">
            <div data-ignore-guard="true">
              <SharedButton
                label="Save"
                onClick={handleSave}
                disabled={!isFormValid}
              />
            </div>
            <div data-ignore-guard="true">
              <SharedButton
                label="Publish"
                onClick={handlePublish}
                disabled={!isFormValid}
              />
            </div>
          </div>
        )}

      <CustomModal
        show={showModal || showPublishModal}
        onClose={() => {
          setShowModal(false)
          setShowPublishModal(false)
          if (showPublishModal) {
            navigate('/hr/hr-reviews')
          }
        }}
        image={DeleteWhiteIcon}
        modalHeading="Successfully"
        modalDesc={
          showModal
            ? 'Yeah, your review form saved successfully'
            : 'Yeah, your review form published successfully'
        }
        type="Success"
        mode="info"
      />

      <CustomModal
        show={showGuardModal}
        onClose={handleGuardClose}
        onConfirm={handleGuardConfirm}
        image={Danger}
        type="Alert"
        modalHeading="Discard unsaved changes?"
        modalDesc="You have unsaved changes. If you leave this page, your changes will be lost."
        mode="confirm"
      />
    </Container>
  )
}
