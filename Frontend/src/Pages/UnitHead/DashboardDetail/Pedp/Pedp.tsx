import { Accordion, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import InfoIconBlack from '@project/assets/images/InfoBlackIcon.svg'
import Manager from '@project/assets/images/Manager.svg'
import ProfilePic from '@project/assets/images/profilePic.svg'
import QuestionMark from '@project/assets/images/QuestionMark.svg'
import ShieldRight from '@project/assets/images/ShieldRight.svg'
import Star from '@project/assets/images/Star.svg'
import Star3 from '@project/assets/images/Star3.svg'
import Tie from '@project/assets/images/Tie.svg'
import CardWithContent from '@project/Components/Card/CardWithContent/CardWithContent'
import Card from '@project/Components/Card/CardWithIcon/Card'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { useGetEmployeeDetailsQuery } from '@project/Store/Api/UnitHead/UnitHeadApi'
import { Goal } from '@project/Types/UnitHead/UnitHeadTypes'

import './Pedp.scss'
import '@project/assets/scss/style.scss'

interface PedpItem {
  count: string
  label: string
  icon: string
}

interface cdp {
  employee_cdp_id: string
  strength: string
  development_need: string
  training_need: string
  no_of_hours: string
}

function Pedp() {
  const { employeeUserId } = useParams<{ employeeUserId: string }>()
  /* ================= API CALLS (UNCHANGED) ================= */
  const { data: getEmpDetails } = useGetEmployeeDetailsQuery(employeeUserId!, {
    skip: !employeeUserId,
    refetchOnMountOrArgChange: true,
  })

  const {
    employee_counters,
    employee_details,
    employee_pedp_form,
    employee_career_development_plan,
  } = getEmpDetails || {}

  // Details Rating
  const PedpData: PedpItem[] = [
    {
      count: employee_counters?.overall ?? '',
      label: 'Overall rating by Appraiser',
      icon: Star3,
    },
    {
      count: employee_counters?.kra ?? '',
      label: 'KRA',
      icon: ShieldRight,
    },
    {
      count: employee_counters?.other ?? '',
      label: 'Other',
      icon: QuestionMark,
    },
    {
      count: employee_counters?.cumulative ?? '',
      label: 'Cumulative rating',
      icon: Star,
    },
    {
      count: employee_counters?.rm_rating ?? '',
      label: 'RM Rating',
      icon: Tie,
    },
    {
      count: employee_counters?.irm_rating ?? '',
      label: 'IRM Rating',
      icon: Manager,
    },
  ]

  const displayInfo = (name: string, value: string) => {
    return (
      <div className="pb-lg-none pb-2">
        <p className="m-0 textLight font14 font400 fontOnest pb-lg-2">{name}</p>
        <div className="d-flex gap-2">
          <p className="m-0">{value}</p>
        </div>
      </div>
    )
  }

  return (
    // <Container>
    <div className="mb-0 unitHeadEmpPedp">
      <Row className="employeeCardGrid">
        {PedpData.map((employeeInfo: PedpItem) => (
          <Col lg={2} md={4} sm={6} className="my-2 my-lg-0">
            <Card
              variant="small"
              icon={employeeInfo.icon}
              heading={employeeInfo.count}
              description={employeeInfo.label}
            />
          </Col>
        ))}
      </Row>

      <CardWithContent heading="Employee details">
        <Row className="align-items-center">
          {/* Profile */}
          <Col lg={1} md={2} sm={3} className="d-flex mb-3 mr-3">
            <div className="profileImageMain">
              <img src={ProfilePic} alt="profilePic" className="profileImage" />
            </div>
          </Col>

          {/* Content */}
          <Col lg={11} md={10} sm={9}>
            <div className="employee-info-grid">
              {displayInfo('Emp ID', employee_details?.employee_lms_id)}
              {displayInfo('Emp Name', employee_details?.employee_name)}
              {displayInfo(
                'Current Designation',
                employee_details?.employee_current_designation
              )}
              {displayInfo(
                'Date of Joining',
                moment(employee_details?.date_of_joining).format('MMM DD, YYYY')
              )}
              {displayInfo(
                'Total IT Experience',
                employee_details?.total_it_experience
              )}
              {displayInfo(
                'Total LMS Experience',
                employee_details?.total_lms_experience
              )}
            </div>
          </Col>
        </Row>
      </CardWithContent>

      <CardWithContent heading="Core competency">
        <p className="font16 font400 fontOnest pb-0">
          {employee_pedp_form?.core_competency_appraisee}
        </p>
      </CardWithContent>

      <div className="untiHeadCustomAccordion">
        <Accordion defaultActiveKey="0">
          {employee_pedp_form?.goals?.map((goal: Goal, idx: number) => (
            <Accordion.Item
              eventKey={idx.toString()}
              key={goal.goal_id}
              className="irmpedpCardBorder"
            >
              {/* ================= Goal Header ================= */}
              <Accordion.Header>{goal.goal_name}</Accordion.Header>

              <Accordion.Body>
                {goal.kras?.map((kra) =>
                  kra.sub_kras?.map((sub) => (
                    <div key={sub.goal_associates_sub_kra_id}>
                      {/* ================= Competency ================= */}
                      <div>
                        <p className="mb-1 font14 textLight">Competency</p>
                        <p className="mb-3">{kra.kra_name}</p>
                      </div>

                      {/* ================= Description ================= */}
                      <div>
                        <p className="mb-1 font14 textLight">Description</p>
                        <p className="mb-3">{sub.sub_kra_name}</p>
                      </div>

                      {/* ================= Table ================= */}
                      <div>
                        <Row>
                          <Col className="m-0 p-0">
                            <div style={{ position: 'relative' }}>
                              <TableResponsive>
                                <table className="equalWidthTable">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        className="custom-th font14 font400"
                                        style={{ verticalAlign: 'top' }}
                                      >
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="onest-regular-14">
                                            Rating by appraisee
                                          </span>
                                        </div>
                                      </th>
                                      <th
                                        scope="col"
                                        className="custom-th font14 font400"
                                        style={{ verticalAlign: 'top' }}
                                      >
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="onest-regular-14">
                                            Remarks by appraisee
                                          </span>
                                        </div>
                                      </th>
                                      <th
                                        scope="col"
                                        className="custom-th font14 font400"
                                        style={{
                                          verticalAlign: 'top',
                                          borderLeft: `2px solid var(--primary)`,
                                        }}
                                      >
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="onest-regular-14">
                                            Rating by appraiser
                                          </span>
                                        </div>
                                      </th>
                                      <th
                                        scope="col"
                                        className="custom-th font14 font400"
                                        style={{ verticalAlign: 'top' }}
                                      >
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="onest-regular-14">
                                            Remarks by appraiser
                                          </span>
                                        </div>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="custom-row">
                                      <td className="custom-td font16 font400">
                                        <p className="mb-0 font16 font400 fontOnest textDark">
                                          {sub.appraisee_rating ?? '-'}
                                        </p>
                                      </td>
                                      <td className="custom-td font16 font400">
                                        <p className="mb-0 font16 font400 fontOnest textDark">
                                          {sub.appraisee_remarks ?? '-'}
                                        </p>
                                      </td>
                                      <td className="tableDropdown">
                                        <p className="mb-0 font16 font400 fontOnest textDark">
                                          {sub?.appraiser_rating}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="mb-0 font16 font400 fontOnest textDark">
                                          {sub?.appraiser_remark}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </TableResponsive>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ))
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      <CardWithContent heading="Competency description">
        <div>
          <p className="mb-0 font14 font400 fontOnest">
            <img src={InfoIconBlack} alt="alertIcon" className="pe-2" />
            <span className="textLight">
              Significant Achievement(s) of Appraisee in the Review Period
            </span>
          </p>
        </div>

        <Row>
          <Col lg={12}>
            <div className="remarkSection my-3">
              <div className="remarkHeading py-3 px-4">
                <p className="mb-0">Remarks by appraisee</p>
              </div>
              <div className="remark py-3 px-4">
                <p className="mb-0">
                  {employee_pedp_form?.core_competency_description_appraisee}
                </p>
              </div>
            </div>

            <div className="remarkSection my-3">
              <div className="remarkHeading py-3 px-4">
                <p className="mb-0">To be filled by appraiser</p>
              </div>
              <div className="remark py-3 px-4">
                <p className="mb-0">
                  {employee_pedp_form?.core_competency_description_appraiseer}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </CardWithContent>

      <CardWithContent
        heading="Career development pan (CDP)"
        className="mb-0 pb-0"
      >
        <div className="pr-4 pb-2 mb-0">
          <p className="mb-0 font14 font400 fontOnest">
            <span className="textLight">
              Strengths, Developmental & Training Needs
            </span>
          </p>
          <p className="mb-0">
            The Appraiser assesses the Appraisee's strengths that contribute to
            job performance and identifies areas for improvement. Additionally,
            relevant training, certifications, or educational programs are
            recommended to enhance professional growth and equip the Appraisee
            with essential skills for successful task execution. Based on these
            needs, a mandatory 32-hour Career Development Plan will be designed,
            including at least 20 hours of technical training and 12 hours of
            soft skills training, providing a clear pathway for career
            progression.
          </p>
        </div>

        <div className="commonTable">
          <TableResponsive maxHeight="50vh">
            <table className="table manageWeightageTable">
              <thead className="custom-thead">
                <tr className="custom-thead-row">
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2 ">
                      <span className="onest-regular-14">#</span>
                    </div>
                  </th>
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">Strengths</span>
                    </div>
                  </th>
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">
                        Development needs
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">
                        Training needs (Technical competency / Soft skills)
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="custom-th font14 font400">
                    <div className="d-flex align-items-center gap-2">
                      <span className="onest-regular-14">No. of hours</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {employee_career_development_plan?.map(
                  (cdp: cdp, index: number) => (
                    <tr className="custom-row">
                      <td className="font16 font400">
                        <p className="mb-0 font16 font400 fontOnest textDark text">
                          {index + 1}
                        </p>
                      </td>
                      <td className="">
                        <p className="mb-0 font16 font400 fontOnest textDark text">
                          {cdp?.strength ?? ''}
                        </p>
                      </td>
                      <td className="">
                        <p className="mb-0 font16 font400 fontOnest textDark text">
                          {cdp?.development_need ?? ''}
                        </p>
                      </td>
                      <td className="">
                        <p className="mb-0 font16 font400 fontOnest textDark text">
                          {cdp?.training_need ?? ''}
                        </p>
                      </td>
                      <td className="">
                        <p className="mb-0 font16 font400 fontOnest textDark text">
                          {cdp?.no_of_hours}
                        </p>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </TableResponsive>
        </div>
      </CardWithContent>
    </div>
  )
}

export default Pedp
