/* eslint-disable */
import { useState } from 'react'

import { Accordion, Col, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import CloseBlackIcon from '@project/assets/images/closeBlackIcon.svg'
import Hat from '@project/assets/images/Hat.svg'
import Hr from '@project/assets/images/Hr.svg'
import InfoIconBlack from '@project/assets/images/InfoBlackIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import Manager from '@project/assets/images/Manager.svg'
import Plus from '@project/assets/images/Plus.svg'
import ProfilePic from '@project/assets/images/profilePic.svg'
import QuestionMark from '@project/assets/images/QuestionMark.svg'
import ShieldRight from '@project/assets/images/ShieldRight.svg'
import Star from '@project/assets/images/Star.svg'
import Star3 from '@project/assets/images/Star3.svg'
import Tie from '@project/assets/images/Tie.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CardWithContent from '@project/Components/Card/CardWithContent/CardWithContent'
import Card from '@project/Components/Card/CardWithIcon/Card'
import DisplayInfo from '@project/Components/DisplayInfo/DisplayInfo'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import { managementRoutes } from '@project/Utils/routeNavigation'
import './Pedp.scss'
import {
  useGetEmployeeDetailsQuery,
  useAddProjectPedpCommentMutation,
} from '@project/Store/Api/Management'
import {
  addPedpProjectCommentReq,
  reviewRatingGoal,
} from '@project/Types/Management/managementPedpTypese'

type PedpDataType = {
  id: number
  heading: string
  description: string
  icon: string
}

const displayInfo = (name: string, value: string, width: string) => {
  return (
    <div style={{ width }} className="pb-lg-none pb-2">
      <p className="m-0 textLight font14 font400 fontOnest pb-lg-2">{name}</p>
      <div className="d-flex gap-2">
        <p className="m-0">{value}</p>
      </div>
    </div>
  )
}

type PedpProps = {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

function Pedp({ setActiveTab }: PedpProps) {
  const { employee_user_id } = useParams<{ employee_user_id: string }>()
  const [openCommentId, setOpenCommentId] = useState<string | null>(null)
  const [remark, setRemark] = useState('')
  const navigate = useNavigate()

  const { data: getEmployeeDetails, refetch: refetchList } =
    useGetEmployeeDetailsQuery(employee_user_id!, {
      skip: !employee_user_id,
      refetchOnMountOrArgChange: true,
    })

  const [addGoalsComment] = useAddProjectPedpCommentMutation()
  const {
    employee_counters,
    employee_details,
    employee_career_development_plan,
    employee_pedp_form,
  } = getEmployeeDetails || {}

  const PedpData = [
    {
      id: 1,
      heading: employee_counters?.overall ?? '-',
      description: 'Overall rating by Appraiser',
      icon: Star3,
    },
    {
      id: 2,
      heading: employee_counters?.kra ?? '-',
      description: 'Kra',
      icon: ShieldRight,
    },
    {
      id: 3,
      heading: employee_counters?.other ?? '-',
      description: 'Other',
      icon: QuestionMark,
    },
    {
      id: 4,
      heading: employee_counters?.cumulative ?? '-',
      description: 'Cumulative rating',
      icon: Star,
    },
    {
      id: 5,
      heading: employee_counters?.rm_rating ?? '-',
      description: 'RM Rating',
      icon: Tie,
    },
    {
      id: 6,
      heading: employee_counters?.irm_rating ?? '-',
      description: 'IRM Rating',
      icon: Manager,
    },
    {
      id: 7,
      heading: employee_counters?.unit_head_rating ?? '-',
      description: 'Unit Head',
      icon: Hat,
    },
    {
      id: 8,
      heading: employee_counters?.hr_rating ?? '-',
      description: 'HR',
      icon: Hr,
    },
  ]

  const handleSaveComment = async (subKraId: string) => {
    try {
      const payload: addPedpProjectCommentReq = {
        employee_user_id: employee_user_id!,
        goal_associates_sub_kra_id: subKraId,
        comments: remark,
      }

      await addGoalsComment(payload).unwrap()

      setRemark('')
      setOpenCommentId(null)
      refetchList()
    } catch (error) {
      console.error(error)
    }
  }

  // const getCommentToggleIcon = (sub: any) => {
  //   if (openCommentId === sub.goal_associates_sub_kra_id) {
  //     return CloseBlackIcon
  //   } else if (sub.comments) {
  //     return EditIcon
  //   } else {
  //     return Plus
  //   }
  // }

  const handleClose = () => {
    navigate(`/${managementRoutes.root}/${managementRoutes.reviewRating}`)
  }

  return (
    <div>
      {/* <Container fluid> */}
      <Row>
        {PedpData?.map((item: PedpDataType) => (
          <Col lg={3} md={6} sm={12} className="my-2">
            <Card
              variant="small"
              icon={item.icon}
              heading={item.heading}
              description={item.description}
            />
          </Col>
        ))}
      </Row>
      <CardWithContent heading="Employee details">
        <Row>
          <Col
            lg={2}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="profileImageMain">
              <img src={ProfilePic} alt="profilePic" className="profileImage" />
            </div>
          </Col>
          <Col lg={10}>
            <Row className="mt-sm-3">
              <Col lg={12} sm={6} className="d-lg-flex mb-lg-3">
                <DisplayInfo
                  name="Emp ID"
                  value={employee_details?.employee_lms_id}
                  width="30%"
                />
                <DisplayInfo
                  name="Emp Name"
                  value={employee_details?.employee_name}
                  width="30%"
                />
                <DisplayInfo
                  name="Current Designation"
                  value={employee_details?.employee_current_designation}
                  width="30%"
                />
                <DisplayInfo
                  name="Date of Joining"
                  value={employee_details?.date_of_joining}
                  width="30%"
                />
              </Col>
              <Col lg={12} sm={6} className="d-lg-flex">
                <DisplayInfo
                  name="Total IT Experience"
                  value={employee_details?.total_it_experience}
                  width="30%"
                />
                <DisplayInfo
                  name="Total LMS Experience"
                  value={employee_details?.total_lms_experience}
                  width="30%"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </CardWithContent>
      <CardWithContent heading="Core compentency">
        <p className="font16 font400 fontOnest">
          Core competencies of a UI/UX designer include a strong understanding
          of user-centered design principles, proficiency in design tools like
          Sketch and Figma, and the ability to conduct user research and
          testing. They must also excel in collaboration, working closely with
          developers and stakeholders to create intuitive interfaces.
          Additionally, a keen eye for detail and a passion for creating
          seamless user experiences are essential.
        </p>
      </CardWithContent>

      <Accordion defaultActiveKey={null} className="customAccordion">
        {employee_pedp_form?.goals?.map(
          (goal: reviewRatingGoal, goalIndex: number) => (
            <Accordion.Item eventKey={String(goalIndex)} key={goal.goal_id}>
              {/* ================= HEADER ================= */}
              <Accordion.Header>
                <p className="font16 font400 fontOnest mb-0">
                  {goal.goal_name}
                  <span>{goal?.goal_rating}</span>
                </p>
              </Accordion.Header>

              {/* ================= BODY ================= */}
              <Accordion.Body className="p-3">
                {goal.kras?.map((kra: any) =>
                  kra.sub_kras?.map((sub: any) => (
                    <div key={sub.goal_associates_sub_kra_id} className="pb-4">
                      {/* -------- Competency & Description -------- */}
                      <Row>
                        <Col lg={12}>
                          {displayInfo('Competency', kra.kra_name, '100%')}
                        </Col>

                        <Col lg={12}>
                          {displayInfo('Description', sub.sub_kra_name, '100%')}
                        </Col>
                      </Row>

                      {/* -------- Ratings Table -------- */}
                      <div className="pt-3">
                        <div className="commonTable pedpTable">
                          <TableResponsive>
                            <table className="table custom-table">
                              <thead>
                                <tr>
                                  <th className="custom-th fw-normal">
                                    Rating by appraisee
                                  </th>
                                  <th className="custom-th fw-normal">
                                    Remarks by appraisee
                                  </th>
                                  <th
                                    className="custom-th fw-normal"
                                    style={{
                                      borderLeft: '2px solid var(--primary)',
                                    }}
                                  >
                                    Rating by appraiser
                                  </th>
                                  <th className="custom-th fw-normal">
                                    Remarks by appraiser
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr className="custom-row">
                                  <td className="custom-td">
                                    {sub.appraisee_rating ?? '-'}
                                  </td>

                                  <td className="custom-td">
                                    {sub.appraisee_remarks ?? '-'}
                                  </td>

                                  <td className="custom-td">
                                    {sub.appraiser_rating ?? '-'}
                                  </td>

                                  <td className="custom-td">
                                    {sub.appraiser_remarks ?? '-'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </TableResponsive>
                        </div>
                      </div>

                      {/* -------- Add Comment Section -------- */}

                      <div
                        className="kraWrapper mt-3"
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                        }}
                      >
                        {/* ===== HEADER ===== */}
                        <div className="lightBlueBg p-3 d-flex justify-content-between align-items-center">
                          <p className="mb-0 primaryColor">
                            {sub?.comments ? 'Edit comment' : 'Add comment'}
                          </p>

                          <button
                            className="border-0 transparentButton pe-3"
                            style={{ backgroundColor: 'transparent' }}
                            onClick={() => {
                              const isOpen =
                                openCommentId === sub.goal_associates_sub_kra_id

                              setOpenCommentId(
                                isOpen ? null : sub.goal_associates_sub_kra_id
                              )

                              if (!isOpen) {
                                setRemark(sub?.comments || '')
                              }
                            }}
                          >
                            <img
                              src={
                                openCommentId === sub.goal_associates_sub_kra_id
                                  ? CloseBlackIcon
                                  : sub?.comments
                                    ? EditIcon
                                    : Plus
                              }
                              alt="toggle"
                            />
                          </button>
                        </div>

                        {/* ===== READ MODE ===== */}
                        {sub?.comments &&
                          openCommentId !== sub.goal_associates_sub_kra_id && (
                            <div className="p-3">
                              <p className="mb-0">{sub.comments}</p>
                            </div>
                          )}

                        {/* ===== EDIT MODE ===== */}
                        {openCommentId === sub.goal_associates_sub_kra_id && (
                          <div className="p-3">
                            <CommonInput
                              className="goalPlaceholder"
                              label="Remarks"
                              placeholder="Please enter remarks"
                              width="100%"
                              value={remark}
                              onChange={(e) => setRemark(e.target.value)}
                            />

                            <div className="pedpButton mt-3">
                              <SharedButton
                                label="Close"
                                variant="outline"
                                onClick={() => setOpenCommentId(null)}
                              />
                              <SharedButton
                                label="Save"
                                onClick={() =>
                                  handleSaveComment(
                                    sub.goal_associates_sub_kra_id
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </Accordion.Body>
            </Accordion.Item>
          )
        )}
      </Accordion>

      <CardWithContent heading="Competency description">
        <div>
          <p className="mb-0 font14 font400 fontOnest">
            <img src={InfoIconBlack} alt="alertIcon" className="pe-2" />
            <span className="textLight">
              Significant Achievement(s) of Appraisee in the Review Period
            </span>
          </p>

          <Row className="pb-3">
            <Col lg={12}>
              <div className="remarkSection my-3">
                <div className="remarkHeading py-3 px-4">
                  <p className="mb-0">Remarks by appraisee</p>
                </div>
                <div className="remark py-3 px-4">
                  <p className="mb-0">
                    1:- Earned the Google UX Certification, enhancing industry
                    expertise.
                  </p>
                  <p className="mb-0">
                    2:- Attended the AI Seminar by Rohan Mishra (UI/UX Designer)
                    to stay updated on industry trends.
                  </p>
                  <p className="mb-0">
                    3:- Completed multiple UI/UX projects across various
                    domains, designing websites, mobile apps, CRM's and admin
                    panels.
                  </p>
                  <p className="mb-0">
                    4:- Engaged in client interactions, gathering feedback, and
                    refining designs.
                  </p>
                </div>
              </div>

              <div className="remarkSection my-3">
                <div className="remarkHeading py-3 px-4">
                  <p className="mb-0">To be filled by appraiser</p>
                </div>
                <div className="remark py-3 px-4">
                  <p className="mb-0">
                    As an Information Risk Manager, I ensure that our team
                    effectively identifies and mitigates potential risks to our
                    information assets. My role involves guiding team members in
                    implementing best practices for data security and
                    compliance.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </CardWithContent>
      <CardWithContent heading="Career development pan (CDP)">
        {displayInfo(
          'Strengths, Developmental & Training Needs',
          'The Appraiser assesses the Appraisees strengths that contribute to job performance and identifies areas for improvement. Additionally,relevant training, certifications, or educational programs are recommended to enhance professional growth and equip the Appraisee with essential skills for successful task execution. Based on these needs, a mandatory 32-hour Career Development Plan will be designed, including at least 20 hours of technical training and 12 hours of soft skills training, providing a clear pathway for career progression.',
          '100%'
        )}
        <div className="commonTable mt-2">
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
                {employee_career_development_plan
                  ?.employee_career_development_plans?.length ? (
                  employee_career_development_plan.employee_career_development_plans.map(
                    (item: any, index: number) => (
                      <tr className="custom-row" key={item.employee_cdp_id}>
                        <td className="font16 font400">
                          <p className="mb-0 font16 font400 fontOnest textDark text">
                            {index + 1}
                          </p>
                        </td>

                        <td>
                          <p className="mb-0 font16 font400 fontOnest textDark text">
                            {item.strength || '-'}
                          </p>
                        </td>

                        <td>
                          <p className="mb-0 font16 font400 fontOnest textDark text">
                            {item.development_need || '-'}
                          </p>
                        </td>

                        <td>
                          <p className="mb-0 font16 font400 fontOnest textDark text">
                            {item.training_need || '-'}
                          </p>
                        </td>

                        <td>
                          <p className="mb-0 font16 font400 fontOnest textDark text">
                            {item.no_of_hours || '-'}
                          </p>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center font14 textLight">
                      No career development data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableResponsive>
        </div>
      </CardWithContent>
      <div className="pedpButton mt-3">
        <SharedButton label="Close" variant="outline" onClick={handleClose} />
        <SharedButton label="Next" onClick={() => setActiveTab('tab2')} />
      </div>
      {/* </Container> */}
    </div>
  )
}

export default Pedp
