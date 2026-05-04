import { InputTextarea } from 'primereact/inputtextarea'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import AlertIcon from '@project/assets/images/AlertIcon.svg'
import chatSquare from '@project/assets/images/chatSquare.svg'
import chatSquareText from '@project/assets/images/chatSquareText.svg'
import DraftIcon from '@project/assets/images/draft.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'
import InfoIcon from '@project/assets/images/Info.svg'
import InfoIconBlack from '@project/assets/images/InfoBlackIcon.svg'
import LineIcon from '@project/assets/images/Line.svg'
import RightWhiteIcon from '@project/assets/images/RightWhiteIcon.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import OverlayText from '@project/Components/OverlayText/OverlayText'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { getIrmInitials } from '@project/Pages/General/Reports/ReportDetails/Pedp/utils'
import {
  useGetPedpDetailsQuery,
  useGetPedpRatingQuery,
  usePedpFormMutation,
} from '@project/Store/Api/Employee/Pedp'
import {
  PedpformReq,
  PedpGoal,
  PedpKra,
  PedpSavePayload,
  PedpSubKra,
} from '@project/Types/Employee/Pedp'
import { showErrorToast } from '@project/Utils/notificationPopup'
import { employeeRoutes } from '@project/Utils/routeNavigation'
import { useUnsavedChangesGuard } from '@project/Utils/useUnsavedChangesGuard'
import { formatDate } from '@project/Utils/utility'

import '@project/Pages/Employee/Pedp/Pedp.scss'

type EditableSubKraFields = 'appraisee_rating_id' | 'appraisee_remarks'

const initialPEDPState: PedpformReq = {
  core_competency_appraise: '',
  core_competency_description_appraise: '',
  form_status: 'Draft',
  goals: [],
}

type RatingType = {
  id: string
  rating: string
  is_remarks_mandatory: boolean | string | number
  title: string
}

export type AppraiserHeader = {
  appraiserName: string
  label: string
}

export type RemarkIconProps = {
  remark?: string | null
  className?: string
}

function RemarkIcon({ remark, className = '' }: RemarkIconProps) {
  const trimmedRemark = remark?.trim()
  const hasRemark = Boolean(trimmedRemark)

  if (!hasRemark) {
    return (
      <span className={className}>
        <img src={chatSquare} alt="chatSquare" />
      </span>
    )
  }

  return (
    <span className={className}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{trimmedRemark}</Tooltip>}
      >
        <img src={chatSquareText} alt="chatSquareText" />
      </OverlayTrigger>
    </span>
  )
}

const getKraAppraiserHeaders = (subKras: PedpSubKra[]): AppraiserHeader[] => {
  const headers = new Map<string, AppraiserHeader>()

  subKras.forEach((subKra) => {
    subKra.appraisers_rating_remarks?.forEach((entry) => {
      const name = entry.appraiser_name?.trim() || 'Appraiser'
      if (!headers.has(name)) {
        headers.set(name, { appraiserName: name, label: name })
      }
    })
  })

  return Array.from(headers.values())
}

const getAppraiserRatingByName = (subKra: PedpSubKra, appraiserName: string) =>
  subKra.appraisers_rating_remarks?.find(
    (entry) => entry.appraiser_name?.trim() === appraiserName
  )?.appraiser_rating || '-'

const getAppraiserRemarkByName = (subKra: PedpSubKra, appraiserName: string) =>
  subKra.appraisers_rating_remarks?.find(
    (entry) => entry.appraiser_name?.trim() === appraiserName
  )?.appraiser_remarks || ''

function Pedp() {
  const [formData, setFormData] = useState<PedpformReq>(initialPEDPState)
  const [showModal, setShowModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [isEdit, setIsEdit] = useState(true)
  const initialFormSnapshotRef = useRef<string>('')

  const { id: userId, lms_id: userLmsId } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.userSlice
  )

  // const shouldSkip = !userId || !userLmsId

  const { data: pedpDetails, refetch } = useGetPedpDetailsQuery(
    {
      employee_lms_id: userLmsId,
      employee_user_id: userId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )
  const { data: getRating } = useGetPedpRatingQuery(
    { rating_for: 'Other' },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const isReviewed = pedpDetails?.form_status === 'Reviewed'
  const lastSubmissionDate = pedpDetails?.last_submission_date || null

  const isSubmissionPast = useMemo(() => {
    if (!lastSubmissionDate) return false
    const deadline = new Date(lastSubmissionDate)
    if (Number.isNaN(deadline.getTime())) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)

    return deadlineDate < today
  }, [lastSubmissionDate])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RatingOptions = useMemo(
    () =>
      getRating?.map((item: RatingType) => ({
        label: String(item?.title),
        value: item.id,
        id: item.id,
        remarksRequired:
          item?.is_remarks_mandatory === true ||
          String(item?.is_remarks_mandatory).toLowerCase() === 'true' ||
          String(item?.is_remarks_mandatory) === '1',
      })) || [],
    [getRating]
  )

  const [submitPedp, { isLoading: submitting }] = usePedpFormMutation()

  const buildComparableSnapshot = useCallback((data: PedpformReq) => {
    const normalized = {
      core_competency_appraise: data.core_competency_appraise || '',
      core_competency_description_appraise:
        data.core_competency_description_appraise || '',
      goals: data.goals.map((goal) => ({
        goal_id: goal.goal_id,
        kras: goal.kras.map((kra) => ({
          kra_id: kra.kra_id,
          sub_kras: kra.sub_kras.map((sub) => ({
            goal_associates_sub_kra_id: sub.goal_associates_sub_kra_id,
            appraisee_rating_id: sub.appraisee_rating_id,
            appraisee_remarks: sub.appraisee_remarks || '',
          })),
        })),
      })),
    }

    return JSON.stringify(normalized)
  }, [])

  useEffect(() => {
    if (!pedpDetails) return

    const nextFormData: PedpformReq = {
      core_competency_appraise: pedpDetails.core_competency_appraise || '',
      core_competency_description_appraise:
        pedpDetails.core_competency_description_appraise || '',
      form_status: pedpDetails.form_status,
      goals: pedpDetails.goals || [],
    }

    setFormData(nextFormData)
    initialFormSnapshotRef.current = buildComparableSnapshot(nextFormData)

    if (isSubmissionPast) {
      setIsEdit(false)
      return
    }

    if (pedpDetails.form_status === 'Reviewed') {
      setIsEdit(false)

      return
    }

    // Draft but already saved
    if (pedpDetails.form_status === 'Draft' && pedpDetails.goals?.length > 0) {
      setIsEdit(false)

      return
    }
    // First time user (Draft + no saved data)
    setIsEdit(true)
  }, [pedpDetails, isSubmissionPast, buildComparableSnapshot])

  const hasUnsavedChanges = useCallback(() => {
    if (!isEdit) return false
    const currentSnapshot = buildComparableSnapshot(formData)
    return currentSnapshot !== initialFormSnapshotRef.current
  }, [formData, isEdit, buildComparableSnapshot])

  const resetUnsavedChanges = useCallback(() => {
    initialFormSnapshotRef.current = buildComparableSnapshot(formData)
  }, [formData, buildComparableSnapshot])

  const {
    showModal: showUnsavedModal,
    handleConfirm,
    handleClose,
  } = useUnsavedChangesGuard({
    hasUnsavedChanges,
    onConfirmDiscard: resetUnsavedChanges,
  })

  const updateFields = (
    g: number,
    k: number,
    s: number,
    field: EditableSubKraFields,
    value: PedpSubKra[EditableSubKraFields]
  ) => {
    setFormData((prev) => {
      const copy: PedpformReq = structuredClone(prev)
      copy.goals[g].kras[k].sub_kras[s][field] = value as never
      return copy
    })
  }

  const isRemarksRequired = useCallback(
    (ratingId?: string) => {
      if (!ratingId) return false
      const rating = RatingOptions.find(
        (r) => String(r.value) === String(ratingId)
      )
      return rating?.remarksRequired ?? false
    },
    [RatingOptions]
  )

  const renderRatingWithRemark = (
    rating?: string | number | null,
    remark?: string | null
  ) => (
    <div className="d-flex align-items-center gap-1 font14 font400">
      <span>{rating || '-'}</span>
      <RemarkIcon remark={remark} className="ms-1 cursor-pointer" />
    </div>
  )

  // ====================== SAVE ======================
  const handleSubmit = async (status: 'Draft' | 'Reviewed') => {
    if (isSubmissionPast) {
      showErrorToast('Submission deadline has passed')
      return
    }

    const payload: PedpSavePayload = {
      core_competency_appraise: formData.core_competency_appraise,
      core_competency_description_appraise:
        formData.core_competency_description_appraise,
      form_status: status,
      goals: formData.goals.flatMap((goal) =>
        goal.kras.flatMap((kra) =>
          kra.sub_kras.map((sub: PedpSubKra) => ({
            goal_associates_sub_kra_id: sub.goal_associates_sub_kra_id,
            appraisee_rating_id: sub.appraisee_rating_id,
            appraisee_remarks: sub.appraisee_remarks,
          }))
        )
      ),
    }

    try {
      await submitPedp(payload).unwrap()

      setShowModal(true)
      resetUnsavedChanges()

      if (status === 'Draft') {
        setIsEdit(false)
      }

      if (status === 'Reviewed') {
        setIsEdit(false)
        setShowPublishModal(false)
      }

      refetch()
    } catch (err) {
      showErrorToast('Something went wrong')
    }
  }

  const isPublishDisabled = () => {
    if (
      // !formData.core_competency_appraise?.trim() ||
      !formData.core_competency_description_appraise?.trim()
    ) {
      return true
    }

    return formData.goals.some((goal) =>
      goal.kras.some((kra) =>
        kra.sub_kras.some((sub) => {
          if (!sub.appraisee_rating?.toString().trim()) return true
          const remarksRequired = isRemarksRequired(sub.appraisee_rating_id)

          if (remarksRequired && !sub.appraisee_remarks?.trim()) {
            return true
          }
          return false
        })
      )
    )
  }

  const isDraftDisabled = useMemo(
    () => !hasUnsavedChanges(),
    [hasUnsavedChanges]
  )

  return (
    <div>
      {pedpDetails && pedpDetails?.goals?.length > 0 ? (
        <div className="pedpMain">
          {/* ================= HEADER ================= */}
          <div className="row">
            <div className="col-12 col-lg-6">
              <h4 className="m-0 font20 font400 fontOnest">PEDP details</h4>
            </div>
            <div className="col-12 col-lg-6 d-flex justify-content-lg-end mt-4 mt-lg-0 gap-2">
              <div className="d-flex align-items-center gap-2">
                {pedpDetails?.form_status === 'Draft' && !isSubmissionPast && (
                  <>
                    <button
                      className="d-flex border-0 bg-transparent"
                      onClick={() => setIsEdit(true)}
                    >
                      <img src={EditIcon} alt="EditIcon" />
                      <h4
                        className="font16 font400 mb-0"
                        style={{ color: 'var(--textDark)' }}
                      >
                        Edit PEDP
                      </h4>
                    </button>
                    <img src={LineIcon} alt="LineIcon" />
                  </>
                )}
              </div>

              <Link
                to={`/${employeeRoutes.root}/${employeeRoutes.help}`}
                className="transparentButton"
              >
                <div className="d-flex align-items-center gap-2">
                  <img src={InfoIcon} alt="InfoIcon" />
                  <h4 className="font16 font400 mb-0">Help</h4>
                </div>
              </Link>
              <img src={LineIcon} alt="LineIcon" />
              {!pedpDetails?.form_status ? (
                <div className="d-flex align-items-center gap-2">
                  <img src={AlertIcon} alt="AlertIcon" />
                  <h4 className="font16 font400 mb-0">Pending</h4>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <h4 className="font16 font400 mb-0">
                    <img
                      src={
                        pedpDetails?.form_status === 'Reviewed'
                          ? PublishedIcon
                          : DraftIcon
                      }
                      alt="Published"
                      className="me-2 mb-1"
                    />
                    {pedpDetails?.form_status}
                  </h4>
                </div>
              )}
            </div>
          </div>

          <div className="pedpMetaStrips">
            {!isReviewed && !isSubmissionPast && (
              <div className="pedpInfoStrip">
                <img src={InfoIconBlack} alt="info" />
                <span className="font14 font400">
                  The last date for self PEDP evaluation is{' '}
                  <strong>{formatDate(lastSubmissionDate)}</strong>. Kindly
                  submit your evaluation before the deadline.
                </span>
              </div>
            )}
            {isSubmissionPast && (
              <div className="pedpDangerStrip">
                <img src={AlertIcon} alt="alert" />
                <span className="font14 font400">
                  Submission deadline was{' '}
                  <strong>{formatDate(lastSubmissionDate)}</strong>. Changes
                  after the deadline may not be accepted.
                </span>
              </div>
            )}
          </div>

          {/* PURPOSE SECTION */}
          <div className="pedpDescription">
            <div className="kraWrapper">
              <div className="kraList mx-0">
                <h3 className="font16 font400 m-0">Purpose</h3>
              </div>
              <div className="p-4 font400">
                The purpose of this appraisal is to evaluate the employee's
                performance over the review period, focusing on the competencies
                relevant to their job role and service line. The evaluator will
                consider the feedback provided by the employee to guide the
                appraisal discussion. We are committed to fostering employee
                development by offering the resources and support needed for
                growth. This assessment will be essential in shaping the
                employee's Development Plan for the next year.
              </div>
            </div>

            {/* Core Competency */}
            <div className="kraWrapper">
              <div className="kraList mx-0">
                <h3 className="font16 font400 fontOnest mb-0">
                  Key Information
                </h3>
              </div>
              <div className="p-4">
                <span className="font14 font400 fontOnest pb-1">
                  Core competency
                  {pedpDetails?.form_status !== 'Reviewed' && isEdit && (
                    <span className="textRed">*</span>
                  )}
                </span>

                <p>{formData.core_competency_appraise || ''}</p>

                <InputTextarea
                  autoResize
                  rows={3}
                  disabled={!isEdit}
                  value={formData.core_competency_appraise}
                  onChange={(e) =>
                    isEdit &&
                    setFormData((prev) => ({
                      ...prev,
                      core_competency_appraise: e.target.value,
                    }))
                  }
                  className="textArea p-3 font14 w-100"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* ===================== DYNAMIC GOALS ===================== */}
            {formData?.goals?.map((goal: PedpGoal, gIndex: number) => (
              <Col
                lg={12}
                className="kraWrapper goalsMain"
                key={`${goal.goal_id}`}
              >
                <Row className="kraList pedpList mx-0">
                  <Col lg={9} sm={12}>
                    <p className="font14 font400 fontOnest mb-0">
                      {goal.goal_name}
                    </p>
                  </Col>
                </Row>

                {goal.kras?.map((kra: PedpKra, kIndex: number) => {
                  const appraiserHeaders = getKraAppraiserHeaders(
                    kra.sub_kras || []
                  )

                  return (
                    <div
                      className="categoryMain padding15 pb-0"
                      key={kra.kra_id}
                    >
                      <div className="categoryHead">
                        <p className="font14 font400 fontOnest mb-0 p-2">
                          {kra.kra_name}
                        </p>
                      </div>

                      {/* {detailId === goal.goal_id && ( */}
                      <div>
                        <div className="commonTable">
                          <TableResponsive>
                            <table className="table custom-table">
                              <thead>
                                <tr className="">
                                  <th
                                    scope="col"
                                    className="font14 font400 fontOnest textLight pb-2 borderNone"
                                    style={{ width: '10%' }}
                                  >
                                    Seconary KRA
                                  </th>
                                  {isReviewed ? (
                                    <th
                                      scope="col"
                                      className="font14 font400 fontOnest textLight pb-2 borderNone"
                                      style={{ width: '10%' }}
                                    >
                                      Employee
                                    </th>
                                  ) : (
                                    <>
                                      <th
                                        scope="col"
                                        className="font14 font400 fontOnest textLight pb-2 borderNone"
                                        style={{ width: '8%' }}
                                      >
                                        Rating
                                      </th>
                                      <th
                                        scope="col"
                                        className="font14 font400 fontOnest textLight pb-2 borderNone"
                                        style={{ width: '12%' }}
                                      >
                                        Remarks
                                      </th>
                                    </>
                                  )}
                                  {pedpDetails?.form_status === 'Reviewed' &&
                                    appraiserHeaders.map((irmHeader) => (
                                      <th
                                        key={irmHeader.appraiserName}
                                        scope="col"
                                        className="font14 font400 fontOnest textLight pb-2 borderNone"
                                        style={{ width: '10%' }}
                                        title={irmHeader.appraiserName}
                                      >
                                        {`Appraiser(${getIrmInitials(irmHeader.label)})`}
                                      </th>
                                    ))}
                                </tr>
                              </thead>

                              <tbody>
                                {kra.sub_kras?.map(
                                  (sub: PedpSubKra, sIndex: number) => (
                                    <tr
                                      className="custom-row"
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={`${sub.goal_associates_sub_kra_id}-${sIndex}`}
                                    >
                                      <td className="custom-td borderNone font14 ">
                                        <OverlayText
                                          text={sub.sub_kra_name}
                                          maxLength={60}
                                        />
                                      </td>

                                      {isReviewed ? (
                                        <td className="custom-td borderNone">
                                          {renderRatingWithRemark(
                                            sub.appraisee_rating,
                                            sub.appraisee_remarks
                                          )}
                                        </td>
                                      ) : (
                                        <>
                                          {isEdit ? (
                                            <td className="tableDropdown borderNone">
                                              <SharedDropDown
                                                options={RatingOptions}
                                                icon={dropDownArrow}
                                                value={sub.appraisee_rating_id}
                                                placeHolder="Select rating"
                                                disabled={!isEdit}
                                                onChange={(e) =>
                                                  isEdit &&
                                                  updateFields(
                                                    gIndex,
                                                    kIndex,
                                                    sIndex,
                                                    'appraisee_rating_id',
                                                    String(e.target.value)
                                                  )
                                                }
                                              />
                                            </td>
                                          ) : (
                                            <td className="custom-td borderNone">
                                              <p className="mb-0 font14 font400 fontOnest textDark ">
                                                {' '}
                                                {sub.appraisee_rating}{' '}
                                              </p>
                                            </td>
                                          )}
                                          {isEdit ? (
                                            <td className="borderNone">
                                              <InputTextarea
                                                autoResize
                                                rows={5}
                                                disabled={
                                                  !isEdit ||
                                                  !sub.appraisee_rating_id
                                                }
                                                value={
                                                  sub.appraisee_remarks || ''
                                                }
                                                onChange={(e) =>
                                                  isEdit &&
                                                  updateFields(
                                                    gIndex,
                                                    kIndex,
                                                    sIndex,
                                                    'appraisee_remarks',
                                                    e.target.value
                                                  )
                                                }
                                                className="textArea p-2 font14 w-100 scroll "
                                              />

                                              {isEdit &&
                                                isRemarksRequired(
                                                  sub.appraisee_rating_id
                                                ) &&
                                                !sub.appraisee_remarks?.trim() && (
                                                  <small className="textRed">
                                                    Remarks are mandatory for
                                                    this rating
                                                  </small>
                                                )}
                                            </td>
                                          ) : (
                                            <td className="custom-td borderNone">
                                              <OverlayText
                                                text={sub.appraisee_remarks}
                                                maxLength={60}
                                                placement="bottom"
                                              />
                                            </td>
                                          )}
                                        </>
                                      )}
                                      {pedpDetails?.form_status ===
                                        'Reviewed' &&
                                        appraiserHeaders.map((irmHeader) => (
                                          <td
                                            key={`${sub.goal_associates_sub_kra_id}-${irmHeader.appraiserName}`}
                                            className="custom-td borderNone"
                                          >
                                            {renderRatingWithRemark(
                                              getAppraiserRatingByName(
                                                sub,
                                                irmHeader.appraiserName
                                              ),
                                              getAppraiserRemarkByName(
                                                sub,
                                                irmHeader.appraiserName
                                              )
                                            )}
                                          </td>
                                        ))}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </TableResponsive>
                        </div>
                      </div>
                      {/* )} */}
                    </div>
                  )
                })}
              </Col>
            ))}

            {/* ====================== FINAL DESCRIPTION ====================== */}
            <div className="kraWrapper">
              <div className="kraList mx-0">
                <p className="font16 m-0">Competency description</p>
              </div>

              <div className="p-4">
                <img src={InfoIconBlack} alt="InfoIconBlack" className="pe-2" />
                Significant achievements...
              </div>

              <Row className="ps-4 pe-4 pb-3">
                {pedpDetails?.form_status === 'Reviewed' && !isEdit ? (
                  <p className="p-0">
                    {formData.core_competency_description_appraise}
                  </p>
                ) : (
                  <InputTextarea
                    id="core_competency_description_appraise"
                    autoResize
                    rows={3}
                    disabled={!isEdit}
                    value={formData.core_competency_description_appraise}
                    onChange={(e) =>
                      isEdit &&
                      setFormData((prev) => ({
                        ...prev,
                        core_competency_description_appraise: e.target.value,
                      }))
                    }
                    className="textArea p-3 font14 w-100"
                  />
                )}
              </Row>
            </div>
          </div>

          {pedpDetails?.form_status !== 'Reviewed' && (
            <div className="d-flex gap-3">
              {/* SAVE BUTTON */}
              <SharedButton
                label={submitting ? 'Saving...' : 'Save as draft'}
                onClick={() => handleSubmit('Draft')}
                disabled={isDraftDisabled || isSubmissionPast}
                dataIgnoreGuard
              />

              <SharedButton
                label="Submit"
                disabled={isPublishDisabled() || isSubmissionPast}
                onClick={() => setShowPublishModal(true)}
                dataIgnoreGuard
              />
            </div>
          )}

          <CustomModal
            show={showModal}
            onClose={() => {
              setShowModal(false)
            }}
            image={RightWhiteIcon}
            type="Success"
            modalHeading="Successfully"
            modalDesc="Yeah, you're PEDP form save successfully"
            mode="info"
          />

          <CustomModal
            show={showPublishModal}
            onClose={() => setShowPublishModal(false)}
            onConfirm={() => handleSubmit('Reviewed')}
            image={AlertIcon}
            modalHeading="Publish Form"
            modalDesc="Please ensure that you have filled in the Project Details and Certification Details as well. After publishing, you will not be able to edit anything."
            type="Warning"
            mode="confirm"
          />
          <CustomModal
            show={showUnsavedModal}
            onClose={handleClose}
            onConfirm={handleConfirm}
            image={AlertIcon}
            type="Alert"
            modalHeading="Discard unsaved changes?"
            modalDesc="You have unsaved changes. If you continue, they will be lost."
            mode="confirm"
          />
        </div>
      ) : (
        <div className="dashboard-container container-fluid">
          <NoRecordFound
            heading="Form is not published yet"
            description="Form is not published yet!"
            className="onlyWithTopSearch"
          />
        </div>
      )}
    </div>
  )
}

export default Pedp
