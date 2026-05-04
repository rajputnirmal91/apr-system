/* eslint-disable */

import { useEffect } from 'react'
import { Accordion, Col, Row } from 'react-bootstrap'
import SharedButton from '@project/Components/Button/SharedButton'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetProjectDetailsListQuery } from '@project/Store/Api/Irm'
import './IrmProjectsTab.scss'
import moment from 'moment'
import { Project } from '@project/Types/Irm/IrmTypes'

export default function IrmProjectsTab({
  onNextTab,
}: {
  onNextTab?: () => void
  onPreview?: () => void
}) {
  const { employee_user_id } = useParams<{ employee_user_id: string }>()
  const navigate = useNavigate()

  const {
    data: getProjectDetailsList,
    refetch: refetchDetails,
    isLoading: isFetching,
  } = useGetProjectDetailsListQuery(employee_user_id!, {
    skip: !employee_user_id,
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

  return (
    <div className="irmProjectsTabWrapper d-flex flex-column">
      <Accordion alwaysOpen>
        {/* eslint-disable-next-line no-nested-ternary */}

        {isFetching ? (
          <p>Loading...</p>
        ) : getProjectDetailsList?.projects?.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          getProjectDetailsList.projects.map(
            (project: Project, index: number) => (
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
                        <p>
                          {displayInfo('Client name', project?.client_name)}
                        </p>
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

                </Accordion.Body>
              </Accordion.Item>
            )
          )
        )}
      </Accordion>

      <div className="d-flex justify-content-start gap-3 mt-auto">
        <SharedButton
          label="Close"
          variant="outline"
          onClick={() => navigate('/irm/irm-dashboard')}
        />
        <SharedButton label="Next" variant="outline" onClick={() => onNextTab?.()} />
      </div>
    </div>
  )
}
