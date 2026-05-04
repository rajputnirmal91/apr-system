import { useState } from 'react'

import { Accordion, Col, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import CloseBlackIcon from '@project/assets/images/closeBlackIcon.svg'
import Plus from '@project/assets/images/Plus.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import Spinner from '@project/Common/Spinner'
import SharedButton from '@project/Components/Button/SharedButton'
import { useGetManagementProjectDetailsListQuery } from '@project/Store/Api/Management'
import { empProject } from '@project/Types/Management/managementEmpProjectTypes'
import { managementRoutes } from '@project/Utils/routeNavigation'

import './Project.scss'

type ProjectProps = {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

function Project({ setActiveTab }: ProjectProps) {
  const [comment, setComment] = useState<boolean>(false)
  const [remark, setRemark] = useState<string>('')
  const navigate = useNavigate()

  const { employee_user_id } = useParams<{ employee_user_id: string }>()

  const { data: getEmpProjectList, isLoading } =
    useGetManagementProjectDetailsListQuery(employee_user_id!, {
      skip: !employee_user_id,
      refetchOnMountOrArgChange: true,
    })

  const handleClose = () => {
    navigate(`/${managementRoutes.root}/${managementRoutes.reviewRating}`)
  }

  if (isLoading) {
    return <Spinner />
  }

  const displayInfo = (name: string, value: string) => {
    return (
      <div className="pb-lg-none pb-2">
        <p className="m-0 textLight font14 font400 fontOnest pb-lg-2">{name}</p>
        <div className="d-flex gap-2">
          <p className="m-0 font16 fontOnest font400">{value}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Accordion defaultActiveKey={null} className="customAccordion">
        {getEmpProjectList &&
          getEmpProjectList.projects &&
          getEmpProjectList.projects.map(
            (projectDetails: empProject, index: number) => (
              <Accordion.Item
                eventKey={String(index)}
                key={projectDetails.project_id}
              >
                {/* Accordion Header */}
                <Accordion.Header>
                  {projectDetails.name_Of_Project}
                </Accordion.Header>

                {/* Accordion Body */}
                <Accordion.Body>
                  <div className="borderBottom">
                    <Row>
                      <Col lg={2}>
                        <p>
                          {displayInfo(
                            'Employee status',
                            projectDetails.employee_status
                          )}
                        </p>
                      </Col>
                      <Col lg={3}>
                        <p>
                          {displayInfo(
                            'Client name',
                            projectDetails.client_name
                          )}
                        </p>
                      </Col>
                      <Col lg={2}>
                        <p>
                          {displayInfo(
                            'Project start date',
                            moment(projectDetails?.project_start_date).format(
                              'MMM DD, YYYY'
                            )
                          )}
                        </p>
                      </Col>
                      <Col lg={3}>
                        <p>
                          {displayInfo(
                            'Mode of project handling',
                            projectDetails.mode_of_project_handling
                          )}
                        </p>
                      </Col>
                      <Col lg={2}>
                        <p>
                          {displayInfo(
                            'Role in project',
                            projectDetails.role_in_project
                          )}
                        </p>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={2}>
                        <p>
                          {displayInfo(
                            'Immediate reporting manager',
                            projectDetails.irm_name
                          )}
                        </p>
                      </Col>
                      <Col lg={3}>
                        <p>
                          {displayInfo(
                            'Secondary reporting manager',
                            projectDetails.secondary_irm_name
                          )}
                        </p>
                      </Col>
                      <Col lg={2}>
                        <p>
                          {displayInfo(
                            'Client reporting manager',
                            projectDetails.client_reporting_manager
                          )}
                        </p>
                      </Col>
                      <Col lg={3}>
                        <p>
                          {displayInfo(
                            'Project end date',
                            projectDetails.project_end_date
                          )}
                        </p>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12}>
                        <p>
                          {displayInfo(
                            'Remarks',
                            projectDetails.remarks || 'No remarks available'
                          )}
                        </p>
                      </Col>
                    </Row>
                  </div>

                  <div className="my-3">
                    <p className="m-0 font16 fontOnest font400 pb-3">
                      Project Feedback & Rating
                    </p>

                    <div className="ratingRemark">
                      <div className="ratingRemarkLeft">
                        <p>
                          {displayInfo(
                            'Rating by manager',
                            projectDetails.rating_by_manager
                          )}
                        </p>
                      </div>
                      <div className="ratingRemarkRight">
                        <p>
                          {displayInfo(
                            'Remark',
                            projectDetails.remarks_by_manager
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="kraWrapper">
                      <div className="kraList mx-0 d-flex justify-content-between align-items-center">
                        <h3 className="font16 font400 fontOnest mb-0 ps-3">
                          <span className="primaryColor">Add comment</span>
                        </h3>
                        <button
                          className="transparentButton pe-3"
                          onClick={() => setComment(!comment)}
                        >
                          <img
                            src={comment ? CloseBlackIcon : Plus}
                            alt="plus"
                          />
                        </button>
                      </div>

                      {comment && (
                        <div className="padding24">
                          <CommonInput
                            className="goalPlaceholder"
                            label="Remarks"
                            placeholder="Please Remarks"
                            width="100%"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                          />
                          <div className="pedpButton mt-3">
                            <SharedButton
                              label="Close"
                              variant="outline"
                              onClick={() => setComment(false)}
                            />
                            <SharedButton label="Save" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )
          )}
      </Accordion>

      <div className="pedpButton pb-4">
        <SharedButton label="Close" variant="outline" onClick={handleClose} />
        <SharedButton
          label="Previous"
          variant="outline"
          onClick={() => setActiveTab('tab1')}
        />
        <SharedButton label="Next" onClick={() => setActiveTab('tab3')} />
      </div>
    </div>
  )
}

export default Project
