/* eslint-disable */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Card, Col, Container, Form, Row, Table } from 'react-bootstrap'

import profilePic from '@project/assets/images/profilePic.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomDropdown from '@project/Components/Dropdown/DropDown'
import {
  useGetEmployeeDetailsQuery,
  useAddIrmRatingRemarkMutation,
} from '@project/Store/Api/Irm/IrmApi'

import './IrmPedpTab.scss'
import {
  RatingType,
  useGetRatingQuery,
} from '@project/Store/Api/Common/commonApi'
import { useNavigate } from 'react-router-dom'

import moment from 'moment'
import { showErrorToast } from '@project/Utils/notificationPopup'
import CustomModal from '@project/Components/Modal/Modal'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import chatSquareText from '@project/assets/images/chatSquareText.svg'
import chatSquare from '@project/assets/images/chatSquare.svg'
import { AppraiserInput } from '@project/Pages/Hr/HrDashboard/HrEmpDetails/HrEmpDetails'
import empDetailsNotFound from '@project/assets/images/empDetailsNotFound.svg'

export type PedpSubKra = {
  goal_associates_sub_kra_id: string
  appraisee_rating?: string | null
  appraisee_remarks?: string | null
  appraiser_rating?: string | null
  appraiser_remarks?: string | null
  sub_kra_name?: string
}

export type PedpKra = {
  kra_id: string
  kra_name: string
  sub_kras: PedpSubKra[]
}

export type PedpGoal = {
  goal_id: string
  goal_name: string
  kras: PedpKra[]
}

export type IrmPedpGoalPayload = {
  goal_associates_sub_kra_id: string
  appraiser_rating: string
  appraiser_remarks?: string | null
}

export type PedpSavePayload = {
  employee_user_id: string
  form_status: string
  goals: IrmPedpGoalPayload[]
}

export default function IrmPedpTab({
  onNextTab,
  onPedpSave,
  pedpPayload,
  isEditing,
  setIsEditing,
}: {
  onNextTab?: () => void
  onPedpSave?: (payload: PedpSavePayload) => void
  pedpPayload?: PedpSavePayload | null
  isEditing?: boolean
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const { employee_user_id } = useParams<{ employee_user_id: string }>()
  const navigate = useNavigate()

  const { data: getEmployeeDetails, refetch: refetchDetails } =
    useGetEmployeeDetailsQuery(employee_user_id!, {
      skip: !employee_user_id,
      refetchOnMountOrArgChange: true,
    })

  const { data: getRating } = useGetRatingQuery(
    { rating_for: 'Other' },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [addIrmRatingRemark] = useAddIrmRatingRemarkMutation()

  const getFormStatus = getEmployeeDetails?.employee_pedp_form?.irm_form_status

  const editSnapshotRef = useRef<Record<string, AppraiserInput> | null>(null)

  const [isPublished, setIsPublished] = useState(false)

  const [appraiserData, setAppraiserData] = useState<
    Record<string, AppraiserInput>
  >({})

  const { employee_details, employee_pedp_form } = getEmployeeDetails || {}

  const RatingOptions =
    getRating?.map((item: RatingType) => ({
      label: String(item.title),
      value: item.id,
      id: item.id,
      remarksRequired: item.is_remarks_mandatory,
    })) || []

  const isRemarksRequired = (rating?: string) => {
    if (!rating) return false
    const found = RatingOptions.find((r) => r.value === rating)
    return found?.remarksRequired ?? false
  }

  const buildPayload = (formStatus: 'Draft' | 'Reviewed'): PedpSavePayload => ({
    employee_user_id: employee_user_id!,
    form_status: formStatus,
    goals: employee_pedp_form.goals.flatMap((goal: PedpGoal) =>
      goal.kras.flatMap((kra: PedpKra) =>
        kra.sub_kras.map((sub: PedpSubKra) => ({
          goal_associates_sub_kra_id: sub.goal_associates_sub_kra_id,
          appraiser_rating_id:
            appraiserData[sub.goal_associates_sub_kra_id]?.appraiser_rating_id,
          appraiser_remarks:
            appraiserData[sub.goal_associates_sub_kra_id]?.appraiser_remarks ??
            null,
        }))
      )
    ),
  })

  const isSaveDisabled = () => {
    if (!employee_pedp_form?.goals) return true

    return employee_pedp_form.goals.some((goal: PedpGoal) =>
      goal.kras?.some((kra) =>
        kra.sub_kras?.some((sub) => {
          const rating =
            appraiserData[sub.goal_associates_sub_kra_id]?.appraiser_rating_id
          const remarks =
            appraiserData[sub.goal_associates_sub_kra_id]?.appraiser_remarks

          if (!rating) return true

          if (isRemarksRequired(rating) && !remarks?.trim()) {
            return true
          }
          return false
        })
      )
    )
  }

  const handleSaveAndNext = async () => {
    if (isSaveDisabled()) return

    const payload = buildPayload('Draft')

    try {
      await addIrmRatingRemark(payload).unwrap()
      onPedpSave?.(payload)
      setIsEditing(false)
      setIsPublished(false)
      refetchDetails()
      onNextTab?.()
    } catch (err) {
      const message = 'Something went wrong while publishing PEDP'
      showErrorToast(message)
    }
  }

  useEffect(() => {
    if (!employee_pedp_form?.goals) return

    const formattedData = employee_pedp_form.goals.reduce(
      (acc, goal) => {
        goal.kras?.forEach((kra) => {
          kra.sub_kras?.forEach((subKra) => {
            const id = subKra.goal_associates_sub_kra_id

            acc[id] = {
              appraiser_rating: subKra.appraiser_rating || '',
              appraiser_rating_id: subKra.appraiser_rating_id || '',
              appraiser_remarks: subKra.appraiser_remarks || '',
            }
          })
        })

        return acc
      },
      {} as Record<string, any>
    )

    setAppraiserData(formattedData)
  }, [employee_pedp_form])

  const handleRatingChange = (id: string, value: string) => {
    if (!isEditing) return

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
    if (!isEditing) return

    setAppraiserData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        appraiser_remarks: value,
      },
    }))
  }

  const handlePublish = async () => {
    if (!pedpPayload) {
      showErrorToast('PEDP details not found')
      return
    }

    const payload: PedpSavePayload = {
      ...pedpPayload,
      form_status: 'Reviewed',
    }

    try {
      await addIrmRatingRemark(payload).unwrap()
      setShowPublishModal(true)
      setIsPublished(true)
      editSnapshotRef.current = null
    } catch {
      const message = 'Something went wrong while publishing PEDP'
      showErrorToast(message)
    }
  }

  const handConfirm = () => {
    setTimeout(() => {
      setShowModal(false)
      setShowPublishModal(false)
      navigate('/irm/irm-dashboard')
    }, 1500)
  }
  const handleClose = () => {
    setShowModal(false)
    setShowPublishModal(false)
    navigate('/irm/irm-dashboard')
  }

  const transformedGoals =
    employee_pedp_form?.goals?.flatMap((goal: any) =>
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

  return (
    <Container fluid className="p-0 irmPedpTabContainer">
      <div className="irmTabInnerContentBody">
        {' '}
        {/* Employee details */}
        <Card className="coreCompetency irmpedpCardBorder irmPedpCard p-0 mb-4">
          <div className="lightBlueBg p-4">
            <p className="mb-0 ">Employee details</p>
          </div>
          <div className="p-4">
            <Row className="g-2">
              <Col md={2} lg={1}>
                <div className="EmployeeDetailsLeft">
                  <img src={profilePic} alt="profilePic" />
                </div>
              </Col>
              <Col md={10} lg={11}>
                <div className="EmployeeDetailsRight">
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Emp ID</p>
                    <p className="mb-0">{employee_details?.employee_lms_id}</p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Emp name</p>
                    <p className="mb-0">{employee_details?.employee_name}</p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Current Designation</p>
                    <p className="mb-0">
                      {employee_details?.employee_current_designation}
                    </p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Date of Joining</p>
                    <p className="mb-0">
                      {moment(employee_details?.date_of_joining).format(
                        'MMM DD, YYYY'
                      )}
                    </p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Total IT Experience</p>
                    <p className="mb-0">
                      {employee_details?.total_it_experience}
                    </p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">
                      Total LMS Experience
                    </p>
                    <p className="mb-0">
                      {employee_details?.total_lms_experience}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        {/* Core competency */}
        {/* Service excellence Accordion */}
        {employee_pedp_form?.goals?.length > 0 ? (
          <div className="coreCompetencyAccordion HrEmpDetailsBody">
            <div className="accordion">
              <Card className="coreCompetency irmpedpCardBorder irmPedpCard p-0 mb-4">
                <div className="lightBlueBg p-4">
                  <p className="mb-0 ">Core competency</p>
                </div>
                <div className="p-4">
                  <p className="mb-0 ">
                    {employee_pedp_form?.core_competency_appraisee}
                  </p>
                </div>
              </Card>

              {employee_pedp_form?.goals?.map((goal: any) => (
                <div
                  key={goal.goal_id}
                  className="accordion-item irmpedpCardBorder"
                >
                  {/* GOAL HEADER */}
                  <h2 className="accordion-header">
                    <div className="d-flex justify-content-between align-items-center w-100 p-3">
                      <span className="font16">{goal.goal_name}</span>
                      <span className="font16">{`Score: ${goal.score}`}</span>
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
                            <div className="pedpDetailsKra p-1 mb-3 d-flex justify-content-between align-items-center">
                              <p className="mb-0">{kra.kra_name}</p>
                              <span className="font16">{`Score: ${kra.score}`}</span>
                            </div>

                            <Table responsive className="mb-4 equalWidthTable">
                              <thead>
                                <tr>
                                  <th
                                    style={{ width: '30%' }}
                                    className="textLight"
                                  >
                                    Seconary Kra
                                  </th>
                                  <th
                                    style={{ width: '20%' }}
                                    className="textLight"
                                  >
                                    Employee
                                  </th>
                                  {/* <th >Remarks by Appraisee</th> */}
                                  <th
                                    style={{ width: '25%' }}
                                    className="textLight"
                                  >
                                    Rating by IRM
                                  </th>
                                  <th
                                    style={{ width: '25%' }}
                                    className="textLight"
                                  >
                                    Remarks by IRM
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
                                      src={subKra.appraisee_remarks ? chatSquareText : chatSquare}
                                      alt="chatSquareText"
                                      title={subKra.appraisee_remarks}
                                    />
                                  </td>
                                  {/* <td>{subKra.appraisee_remarks || '-'}</td> */}

                                  {/* HR RATING */}

                                  <td style={{ width: '25%' }}>
                                    {!isEditing ? (
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
                                          appraiserData[id]
                                            ?.appraiser_rating_id || ''
                                        }
                                        disabled={
                                          !isEditing ||
                                          getFormStatus === 'Reviewed'
                                        }
                                        onChange={(e: any) =>
                                          handleRatingChange(id, e.target.value)
                                        }
                                      />
                                    )}
                                  </td>

                                  {/* IRM REMARK */}

                                  <td style={{ width: '25%' }}>
                                    {!isEditing ? (
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
                                            !isEditing ||
                                            getFormStatus === 'Reviewed'
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

      <div
        className="d-flex justify-content-start mt-4 "
        style={{ position: 'absolute', bottom: '24px', gap: '24px' }}
      >
        <SharedButton
          label="Close"
          variant="outline"
          onClick={() => navigate('/irm/irm-dashboard')}
        />

        {employee_pedp_form?.irm_form_status !== 'Reviewed' && (
          <SharedButton
            label="Save as a Draft"
            disabled={isSaveDisabled()}
            onClick={handleSaveAndNext}
          />
        )}

        {getFormStatus !== 'Reviewed' && (
          <SharedButton
            label="Publish"
            disabled={isSaveDisabled()}
            onClick={() => {
              handlePublish()
            }}
          />
        )}

      </div>

      <CustomModal
        show={showModal || showPublishModal}
        onClose={handleClose}
        onConfirm={handConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Successfully"
        modalDesc={
          showModal
            ? 'Yeah, you are PEDP form save successfully'
            : 'Yeah, you are PEDP form Publish successfully'
        }
        type="Success"
        mode="info"
      />
    </Container>
  )
}
