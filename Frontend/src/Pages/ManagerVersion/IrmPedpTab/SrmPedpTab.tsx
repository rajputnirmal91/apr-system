/* eslint-disable */
import { useParams } from 'react-router-dom'

import {
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap'

import profilePic from '@project/assets/images/profilePic.svg'
import SharedButton from '@project/Components/Button/SharedButton'

import './SrmPedpTab.scss'
import { useNavigate } from 'react-router-dom'

import moment from 'moment'
import chatSquareText from '@project/assets/images/chatSquareText.svg'
import chatSquare from '@project/assets/images/chatSquare.svg'
import empDetailsNotFound from '@project/assets/images/empDetailsNotFound.svg'
import { useGetEmployeeDetailsQuery } from '@project/Store/Api/Manager'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { getIrmInitials } from '@project/Pages/General/Reports/ReportDetails/Pedp/utils'
import {
  AppraiserHeader,
  RemarkIconProps,
} from '@project/Pages/Employee/Pedp/Pedp'
import OverlayText from '@project/Components/OverlayText/OverlayText'

export type PedpSubKra = {
  goal_associates_sub_kra_id: string
  appraisee_rating?: string | null
  appraisee_remarks?: string | null
  appraiser_rating?: string | null
  appraiser_remarks?: string | null
  appraisers_rating_remarks?: {
    appraiser_name?: string
    appraiser_rating?: string
    appraiser_remarks?: string
  }[]
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
  onPreview,
}: {
  onNextTab?: () => void
  onPedpSave?: (payload: PedpSavePayload) => void
  pedpPayload?: PedpSavePayload | null
  isEditing?: boolean
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>
  onPreview?: () => void
}) {
  const { employee_user_id } = useParams<{ employee_user_id: string }>()
  const navigate = useNavigate()

  const { data: getEmployeeDetails } = useGetEmployeeDetailsQuery(
    employee_user_id!,
    {
      skip: !employee_user_id,
      refetchOnMountOrArgChange: true,
    }
  )

  const { employee_details, employee_pedp_form, goals } =
    getEmployeeDetails?.pedp || {}

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

  const renderRatingWithRemark = (
    rating?: string | number | null,
    remark?: string | null
  ) => (
    <div className="d-flex align-items-center gap-1 font14 font400">
      <span>{rating || '-'}</span>
      <RemarkIcon remark={remark} className="ms-1 cursor-pointer" />
    </div>
  )

  const getAppraiserRatingByName = (
    subKra: PedpSubKra,
    appraiserName: string
  ) =>
    subKra.appraisers_rating_remarks?.find(
      (entry) => entry.appraiser_name?.trim() === appraiserName
    )?.appraiser_rating || '-'

  const getAppraiserRemarkByName = (
    subKra: PedpSubKra,
    appraiserName: string
  ) =>
    subKra.appraisers_rating_remarks?.find(
      (entry) => entry.appraiser_name?.trim() === appraiserName
    )?.appraiser_remarks || ''

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
                    <p className="mb-0">{employee_details?.employee_id}</p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Emp name</p>
                    <p className="mb-0">{employee_details?.employee_name}</p>
                  </div>
                  <div className="EmployeeDetailsRightItem">
                    <p className="mb-1 font14 textLight">Current Designation</p>
                    <p className="mb-0">
                      {employee_details?.current_designation}
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
        {goals?.length > 0 ? (
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

              {goals?.map((goal: any) => (
                <div
                  key={goal.goal_id}
                  className="accordion-item irmpedpCardBorder"
                >
                  {/* GOAL HEADER */}
                  <h2 className="accordion-header">
                    <div className="d-flex justify-content-between align-items-center w-100 p-3">
                      <span className="font16">{goal.goal_name}</span>
                    </div>
                  </h2>

                  {/* GOAL BODY */}
                  <div className="accordion-body ">
                    {goal.kras.map((kra: any) =>
                      kra.sub_kras.map((subKra: any) => {
                        const id = subKra.goal_associates_sub_kra_id

                        const appraiserHeaders = getKraAppraiserHeaders(
                          kra.sub_kras || []
                        )

                        return (
                          <div key={id} className="mb-4">
                            {/* KRA */}
                            <div className="pedpDetailsKra p-1 mb-3 d-flex justify-content-between align-items-center">
                              <p className="mb-0">{kra.kra_name}</p>
                            </div>
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
                                        <th
                                          scope="col"
                                          className="font14 font400 fontOnest textLight pb-2 borderNone"
                                          style={{ width: '10%' }}
                                        >
                                          Employee
                                        </th>

                                        {appraiserHeaders.map((irmHeader) => (
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

                                            <td className="custom-td borderNone">
                                              {renderRatingWithRemark(
                                                sub.appraisee_rating,
                                                sub.appraisee_remarks
                                              )}
                                            </td>

                                            {appraiserHeaders.map(
                                              (irmHeader) => (
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
                                              )
                                            )}
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </TableResponsive>
                              </div>
                            </div>
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

        <SharedButton
          label="Previous"
          variant="outline"
          onClick={() => {
            if (onPreview) onPreview()
          }}
        />

        <SharedButton
          label="Next"
          variant="outline"
          onClick={() => onNextTab?.()}
        />
      </div>
    </Container>
  )
}
