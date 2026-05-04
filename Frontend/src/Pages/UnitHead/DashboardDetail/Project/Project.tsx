import { useEffect } from 'react'

import { Accordion, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import Spinner from '@project/Common/Spinner'
import { useGetProjectDetailsListQuery } from '@project/Store/Api/UnitHead/UnitHeadApi'
import { EmpProject } from '@project/Types/UnitHead/UnitHeadTypes'

import './Project.scss'

export default function Project() {
  const { employeeUserId } = useParams<{ employeeUserId: string }>()

  const {
    data: getProjectDetailsList,
    refetch: refetchDetails,
    isLoading: isFetching,
  } = useGetProjectDetailsListQuery(employeeUserId!, {
    skip: !employeeUserId,
    refetchOnMountOrArgChange: true,
  })

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

  useEffect(() => {
    refetchDetails()
  }, [refetchDetails])

  if (isFetching) {
    return (
      <div className="irmProjectsTabWrapper d-flex flex-column">
        <Spinner />
      </div>
    )
  }

  if (!getProjectDetailsList?.projects?.length) {
    return (
      <div className="irmProjectsTabWrapper d-flex flex-column">
        <p>No Data Found</p>
      </div>
    )
  }

  return (
    <div className="irmProjectsTabWrapper d-flex flex-column">
      <Accordion defaultActiveKey="0">
        {getProjectDetailsList.projects?.map(
          (project: EmpProject, index: number) => (
            <Accordion.Item eventKey={String(index)} key={project.id}>
              <Accordion.Header>
                <h3 className="font16 font400 fontOnest mb-0">
                  {project.name_Of_Project}
                </h3>
              </Accordion.Header>

              <Accordion.Body className="pt-3 px-4">
                <div className="borderBottom">
                  <Row>
                    <Col lg={2}>
                      <p>
                        {displayInfo(
                          'Employee status',
                          project.employee_status
                        )}
                      </p>
                    </Col>
                    <Col lg={3}>
                      <p>{displayInfo('Client name', project?.client_name)}</p>
                    </Col>
                    <Col lg={2}>
                      <p>
                        {displayInfo(
                          'Project start date',
                          moment(project?.project_start_date).format(
                            'MMM DD, YYYY'
                          )
                        )}
                      </p>
                    </Col>

                    <Col lg={3}>
                      <p>
                        {displayInfo(
                          'Mode of project handling',
                          project.mode_of_project_handling
                        )}
                      </p>
                    </Col>
                    <Col lg={2}>
                      <p>
                        {displayInfo(
                          'Role in project',
                          project.role_in_project
                        )}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={2}>
                      <p>
                        {displayInfo(
                          'Immediate reporting manager',
                          project.irm_name
                        )}
                      </p>
                    </Col>
                    <Col lg={3}>
                      <p>
                        {displayInfo(
                          'Secondary reporting manager',
                          project.secondary_irm_name
                        )}
                      </p>
                    </Col>
                    <Col lg={2}>
                      <p>
                        {displayInfo(
                          'Client reporting manager',
                          project.client_reporting_manager
                        )}
                      </p>
                    </Col>
                    <Col lg={3}>
                      <p>
                        {displayInfo(
                          'Project end date',
                          project.project_end_date
                        )}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12}>
                      <p>{displayInfo('Remarks', project.remarks)}</p>
                    </Col>
                  </Row>
                </div>

                {/* ---- Feedback & Rating Table ---- */}
                <div className="my-3">
                  <p className="mb-1 font16 fontOnest font400">
                    Project Feedback & Rating
                  </p>

                  <div className="ratingRemark ">
                    <div className="ratingRemarkLeft ">
                      <p>
                        {displayInfo(
                          'Rating by manager',
                          project.rating_by_manager
                        )}
                      </p>
                    </div>
                    <div className="ratingRemarkRight  ">
                      <p>{displayInfo('Remark', project.remarks_by_manager)}</p>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          )
        )}
      </Accordion>
    </div>
  )
}
