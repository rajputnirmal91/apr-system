import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import chatSquare from '@project/assets/images/chatSquare.svg'
import chatSquareText from '@project/assets/images/chatSquareText.svg'
import EditIcon from '@project/assets/images/EditBlueIcon.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import EditDeadlinesModal from '@project/Components/EditDeadlinesModal/EditDeadlinesModal'
import OverlayText from '@project/Components/OverlayText/OverlayText'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import {
  usePedpMutation,
  useUpdateDeadlinesMutation,
} from '@project/Store/Api/General/Reports/reports'
import type { Employee } from '@project/Types/reports'
import { formatDate } from '@project/Utils/utility'

import usePedpDeadlines from './usePedpDeadlines'
import type { SubKraWithRatings } from './utils'
import {
  buildUpdateDeadlinesPayload,
  getAppraiseeRemark,
  getIrmRatingByName,
  getIrmRemarkByName,
  getKraIrmHeaders,
} from './utils'

import './Pedp.scss'

type PedpProps = {
  employee: Employee
}

type AppraiserRatingRemark = {
  appraiser_name?: string | null
  appraiser_rating?: string | null
  appraiser_remarks?: string | null
}

type SubKra = {
  sub_kra_id: string
  sub_kra_name: string
  appraisee_rating?: string | null
  appraisee_remarks?: string | null
  appraisers_rating_remarks?: AppraiserRatingRemark[]
}

type IrmHeader = {
  appraiserName: string
  label: string
}

type Kra = {
  kra_id: string
  kra_name: string
  sub_kras: SubKra[]
}

type Goal = {
  goal_id: string
  goal_name: string
  kras: Kra[]
}

type InfoItemProps = {
  name: string
  value: string
  status?: string
}

const InfoItem = memo(function InfoItem({
  name,
  value,
  status,
}: InfoItemProps) {
  const icon = status ? getStatusIcon(status) : null

  return (
    <div className="">
      <p className="m-0 textLight font14 font400 fontOnest pb-2">{name}</p>
      <div className="d-flex gap-1">
        {icon && icon}
        <p className="m-0 font14 font400 fontOnest">{value}</p>
      </div>
    </div>
  )
})

type RemarkIconProps = {
  remark: string
  className: string
}

const RemarkIcon = memo(function RemarkIcon({
  remark,
  className,
}: RemarkIconProps) {
  const hasRemark = remark && remark !== 'No remarks'

  if (!hasRemark) {
    return (
      <span className={className}>
        <img src={chatSquare} alt="chatSquare" />
      </span>
    )
  }

  return (
    <span className={className}>
      <OverlayTrigger placement="top" overlay={<Tooltip>{remark}</Tooltip>}>
        <img src={chatSquareText} alt="chatSquareText" />
      </OverlayTrigger>
    </span>
  )
})

function Pedp({ employee }: PedpProps) {
  const [pedpTrigger, { data, isLoading }] = usePedpMutation()
  const [deadLineAdded] = useUpdateDeadlinesMutation()

  const [showEditModal, setShowEditModal] = useState(false)

  const handlePedpData = useCallback(() => {
    pedpTrigger({
      employee_lms_id: employee.employee_id,
      employee_user_id: employee.user_id,
    })
  }, [employee.employee_id, employee.user_id, pedpTrigger])

  useEffect(() => {
    if (employee?.user_id) {
      handlePedpData()
    }
  }, [employee?.user_id, handlePedpData])

  const formReviewDeadline = data?.pedp?.pedp_deadline_details ?? null
  const employeeDetails = data?.pedp?.employee_details

  const { deadlines, setDeadlines } = usePedpDeadlines(formReviewDeadline)

  const handleUpdateDeadlines = useCallback(
    (updated: typeof deadlines): Promise<boolean> => {
      setDeadlines(updated)

      const updateDeadline = buildUpdateDeadlinesPayload(
        employee.user_id,
        updated
      )

      return deadLineAdded(updateDeadline)
        .unwrap()
        .then(() => {
          handlePedpData()
          return true
        })
        .catch(() => false)
    },
    [deadLineAdded, employee.user_id, handlePedpData, setDeadlines]
  )

  const deadlineInfoItems = useMemo(
    () => [
      {
        name: 'Employee',
        value: formatDate(formReviewDeadline?.employee_submission_deadline),
        status: formReviewDeadline?.employee_submission_status,
      },
      {
        name: 'HR',
        value: formatDate(formReviewDeadline?.hr_submission_deadline),
        status: formReviewDeadline?.hr_submission_status,
      },
      {
        name: 'IRM',
        value: formatDate(formReviewDeadline?.irm_submission_deadline),
        status: formReviewDeadline?.irm_submission_status,
      },
      {
        name: 'SRM',
        value: formatDate(formReviewDeadline?.srm_submission_deadline),
        status: formReviewDeadline?.srm_submission_status,
      },
      {
        name: 'Direct Engineer',
        value: formatDate(
          formReviewDeadline?.director_engineer_submission_deadline
        ),
        status: formReviewDeadline?.director_engineer_status,
      },
      {
        name: 'Unit head',
        value: formatDate(formReviewDeadline?.unit_head_submission_deadline),
        status: formReviewDeadline?.unit_head_submission_status,
      },
      {
        name: 'Management',
        value: formatDate(formReviewDeadline?.management_submission_deadline),
        status: formReviewDeadline?.management_submission_status,
      },
    ],
    [formReviewDeadline]
  )

  const employeeInfoRows = useMemo(
    () => [
      [
        { name: 'Emp ID', value: employeeDetails?.employee_id || '' },
        {
          name: 'Current designation',
          value: employeeDetails?.current_designation || '',
        },
        {
          name: 'Joining date',
          value: formatDate(employeeDetails?.joining_date) || '',
        },
        {
          name: 'Review period',
          value: employeeDetails?.review_period || '',
        },
      ],
      [
        {
          name: 'Total IT experience',
          value: employeeDetails?.total_it_experience || '',
        },
        {
          name: 'Total LMS experience',
          value: employeeDetails?.total_lms_experience || '',
        },
        { name: 'Appraiser', value: employeeDetails?.appraiser || '' },
      ],
    ],
    [employeeDetails]
  )

  const ratings = data?.pedp?.ratings || []

  const goalsWithHeaders = useMemo(() => {
    const goals: Goal[] = data?.pedp?.goals || []

    return goals.map((goal) => ({
      ...goal,
      kras: (goal?.kras || []).map((kra) => ({
        ...kra,
        irmHeaders: getKraIrmHeaders(
          (kra?.sub_kras || []) as unknown as SubKraWithRatings[]
        ),
      })),
    }))
  }, [data?.pedp?.goals])

  if (isLoading) {
    return (
      <div className="py-2 d-flex align-items-center gap-2">
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
        <p className="mb-0">...Loading Pedp details</p>
      </div>
    )
  }

  return (
    <>
      <div className="marginTop24">
        <div className="bgRadius padding15">
          <div className="d-flex justify-content-between">
            <h4 className="m-0 font16 font400 fontOnest">
              Form Review Deadline’s
            </h4>
            <div className="d-flex gap-1">
              <button
                className="transparentButton"
                onClick={() => setShowEditModal(true)}
              >
                <div className="d-flex gap-2">
                  <img src={EditIcon} alt="editIcon" />
                  <h4 className="m-0 font16 font400 fontOnest primaryColor">
                    Edit deadlines
                  </h4>
                </div>
              </button>
            </div>
          </div>
          <div className="d-flex flex-xxl-row flex-column displayInfo borderBottom">
            {deadlineInfoItems.map((item) => (
              <InfoItem
                key={item.name}
                name={item.name}
                value={item.value}
                status={item.status}
              />
            ))}
          </div>
        </div>

        <div className="bgRadius marginTop24 padding15">
          <h4 className="m-0 font16 font400 fontOnest">Employee Details</h4>
          <Row className="my-3">
            {employeeInfoRows[0].map((item) => (
              <Col lg={3} key={item.name}>
                <InfoItem name={item.name} value={item.value} />
              </Col>
            ))}
          </Row>
          <Row className="my-3 mb-0">
            {employeeInfoRows[1].map((item) => (
              <Col lg={3} key={item.name}>
                <InfoItem name={item.name} value={item.value} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <div>
        <p className="py-3 mb-0 font16">Rating Key</p>
        <div className="padding15 ratingMain">
          <p className="mb-0 textLight font14 font400 fontOnest pb-2">Scale</p>
          <div className="d-flex flex-column gap-2 font14">
            {ratings.map((rating: string) => (
              <p className="mb-0 font14 font400 fontOnest" key={rating}>
                <span className="font14">{rating}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="goalsMain">
        <p className="py-3 mb-0">Goals</p>
        {goalsWithHeaders.map((goal) => (
          <div className="goalCategory mb-3" key={goal.goal_id}>
            <div className="goalsHead padding15">
              <p className="font14 font400 fontOnest mb-0">{goal.goal_name}</p>
            </div>
            {goal?.kras?.map((kra: Kra & { irmHeaders: IrmHeader[] }) => (
              <div className="categoryMain padding15 pb-0" key={kra.kra_id}>
                <div className="categoryHead">
                  <p className="font14 font400 fontOnest mb-0 p-2">
                    {kra.kra_name}
                  </p>
                </div>

                <div className="container mx-0 pedpTable">
                  <TableResponsive>
                    <table className="tableMain">
                      <thead>
                        <tr className="border-bottom">
                          <th
                            scope="col"
                            className="font14 font400 fontOnest textLight pb-2"
                            style={{ width: '20%' }}
                          >
                            Seconary KRA
                          </th>
                          <th
                            scope="col"
                            className="font14 font400 fontOnest textLight pb-2"
                            style={{ width: '10%' }}
                          >
                            Employee
                          </th>
                          {kra.irmHeaders.map((irmHeader) => {
                            const name = irmHeader.appraiserName?.trim() || 'HR'

                            return (
                              <th
                                key={name}
                                scope="col"
                                className="font14 font400 fontOnest textLight pb-2"
                                style={{ width: '10%' }}
                                title={name}
                              >
                                {irmHeader.label}
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {kra?.sub_kras?.map((subKra) => {
                          const appraiseeRemark = getAppraiseeRemark(subKra)

                          return (
                            <tr key={subKra?.sub_kra_id} className="">
                              <td className="pb-2 font400 fontOnest">
                                <OverlayText
                                  text={subKra.sub_kra_name}
                                  maxLength={50}
                                />
                              </td>
                              <td className="pb-2 font14 font400 fontOnest">
                                {subKra?.appraisee_rating || '-'}
                                <RemarkIcon
                                  remark={appraiseeRemark}
                                  className="ms-1 cursor-pointer ms-2"
                                />
                              </td>
                              {kra.irmHeaders.map((irmHeader) => {
                                const irmRemark = getIrmRemarkByName(
                                  subKra,
                                  irmHeader.appraiserName
                                )

                                return (
                                  <td
                                    key={`${subKra?.sub_kra_id}-${irmHeader.appraiserName}`}
                                    className="pb-2 font14 font400 fontOnest"
                                  >
                                    {getIrmRatingByName(
                                      subKra,
                                      irmHeader.appraiserName
                                    )}
                                    <RemarkIcon
                                      remark={irmRemark}
                                      className="ms-1 cursor-pointer"
                                    />
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </TableResponsive>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <p className="pt-3 mb-0 font16 font400 fontOnest mb-2">
          Core Competency
        </p>
        <div className="padding15 bgRadius">
          <p className="font14 font400 fontOnest textLight mb-1">Appraisee</p>
          <p className="font14 font400 fontOnest mb-0">
            {data?.pedp?.core_competency_appraisee}
          </p>
        </div>
      </div>
      <div>
        <p className="pt-3 mb-0 font16 font400 fontOnest mb-2">
          Core Competency Description
        </p>
        <div className="padding15 bgRadius">
          <p className="font14 font400 fontOnest textLight mb-1">Appraisee</p>
          <p className="font14 font400 fontOnest mb-0">
            {data?.pedp?.core_competency_description_appraisee}
          </p>
        </div>
      </div>
      <EditDeadlinesModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        title="Edit Deadlines"
        deadlines={deadlines}
        onUpdate={handleUpdateDeadlines}
      />
    </>
  )
}

export default Pedp
