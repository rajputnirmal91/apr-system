import { useState } from 'react'

import { Accordion, Form, Spinner } from 'react-bootstrap'
import moment from 'moment'

import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import noProjectFound from '@project/assets/images/noProjectFound.svg'
import getStatusIcon from '@project/Common/GetStatusIcon'
import SharedButton from '@project/Components/Button/SharedButton'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useGetProjectDetailsListQuery,
  useUpdateProjectDetailsMutation,
} from '@project/Store/Api/Employee/ProjectDetails'
import { MODE_OF_PROJECT_HANDELING, ROLE_IN_TEAM } from '@project/Utils'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'

/* ---------------- TYPES ---------------- */

interface ProjectApiResponse {
  project_id: string
  employee_status: string
  name_Of_Project: string
  client_name: string
  project_start_date: string
  project_end_date: string | null
  mode_of_project_handling: string | null
  role_in_project: string | null
  irm_name: string | null
  secondary_irm_name: string | null
  client_reporting_manager: string | null
  remarks: string | null
  pedp_form_status: string
}

/* ------------ REUSABLE FIELD ------------ */

function DetailField({
  label,
  value,
  labelTitle,
}: {
  label: string
  value?: string | null
  labelTitle?: string
}) {
  return (
    <div className="DetailRightColumn">
      <p className="projectDetailsHeading" title={labelTitle}>
        {label}
      </p>
      <p className="m-0">{value || '—'}</p>
    </div>
  )
}

/* ------------ MAIN COMPONENT ------------ */

export default function ProjectDetailsList() {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedRemark, setEditedRemark] = useState('')

  const [modeOfProjectHandling, setModeOfProjectHandling] = useState<string>('')

  const [roleInProject, setRoleInProject] = useState<string>('')

  const [activeKey, setActiveKey] = useState<string | null>(null)

  /* -------- API -------- */
  const { data, isLoading, refetch } = useGetProjectDetailsListQuery({})
  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectDetailsMutation()

  const projects: ProjectApiResponse[] = data?.projects || []

  /* -------- HANDLERS -------- */

  const handleEditClick = (
    index: number,
    currentRemark: string | null,
    currentModeOfProjectHandling: string | null,
    currentRoleInProject: string | null
  ) => {
    setEditingIndex(index)
    setEditedRemark(currentRemark || '')
    setRoleInProject(currentRoleInProject || '')
    setModeOfProjectHandling(currentModeOfProjectHandling || '')
    setActiveKey(String(index))
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditedRemark('')
    setModeOfProjectHandling('')
    setRoleInProject('')
    setActiveKey(null) // collapses accordion
  }

  const handleSave = async (project: ProjectApiResponse) => {
    try {
      // Correctly call the mutation function obtained from the hook
      await updateProject({
        projects: [
          {
            project_id: project.project_id,
            remarks: editedRemark,
            role_in_project: roleInProject,
            mode_of_project_handling: modeOfProjectHandling,
          },
        ],
      }).unwrap()
      showSuccessToast('Remarks updated successfully')
      // Reset editing state
      setEditingIndex(null)
      setEditedRemark('')
      setModeOfProjectHandling('')
      setRoleInProject('')

      // Refetch the list after update
      refetch()
    } catch (error) {
      showErrorToast('Failed to update remarks')
    }
  }

  /* -------- RENDER -------- */

  return (
    <div className="projectDetails position-relative">
      {(isLoading || projects.length > 0) && (
        <TopSearch title="My Projects" showButton={false} />
      )}

      {(isLoading || isUpdating) && (
        <div className="customSpinnerOverlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <Accordion
        className="projectDetailsAccordion"
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(key as string | null)}
      >
        {projects.length > 0
          ? projects.map((project, index) => (
              <Accordion.Item
                eventKey={String(index)}
                className="mb-3"
                key={project.project_id}
              >
                <Accordion.Header className="projectListHeader">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <p className="m-0">
                      {project.name_Of_Project || 'Unnamed Project'}
                    </p>

                    {project?.pedp_form_status !== 'Complete' && (
                      <div
                        className="d-flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="customListBtn"
                          onClick={() =>
                            handleEditClick(
                              index,
                              project.remarks,
                              project.mode_of_project_handling,
                              project.role_in_project
                            )
                          }
                        >
                          <img src={EditIcon} alt="Edit" />
                        </button>
                      </div>
                    )}
                  </div>
                </Accordion.Header>

                <Accordion.Body className="projectListBody">
                  <div className="projectListContent">
                    <DetailField
                      label="Employee Status"
                      value={project.employee_status}
                    />
                    <DetailField
                      label="Client Name"
                      value={project.client_name}
                    />
                    <DetailField
                      label="Start Date"
                      value={
                        project.project_start_date
                          ? moment(project.project_start_date).format(
                              'DD MMM, YYYY'
                            )
                          : '—'
                      }
                    />
                    <DetailField
                      label="End Date"
                      value={
                        project.project_end_date
                          ? moment(project.project_end_date).format(
                              'DD MMM, YYYY'
                            )
                          : '—'
                      }
                    />
                    <p
                      style={{ color: 'var(--textLight)', marginBottom: '0px' }}
                    >
                      Form Status
                      <p style={{ color: 'var(--textDark)' }}>
                        {getStatusIcon(project?.pedp_form_status)}{' '}
                        {project?.pedp_form_status}
                      </p>
                    </p>
                    <DetailField
                      label="IRM"
                      value={project.irm_name}
                      labelTitle="Immediate Reporting Manager"
                    />
                    <DetailField
                      label="SRM"
                      value={project.secondary_irm_name}
                      labelTitle="Secondary Reporting Manager"
                    />
                    <DetailField
                      label="CRM"
                      value={project.client_reporting_manager}
                      labelTitle="Client Reporting Manager"
                    />
                    {editingIndex === index ? (
                      <div className="DetailRightColumn d-flex flex-column">
                        <p className="projectDetailsHeading">
                          Project Handling Mode
                        </p>
                        <SharedDropDown
                          options={MODE_OF_PROJECT_HANDELING}
                          value={modeOfProjectHandling}
                          onChange={(e) =>
                            setModeOfProjectHandling(String(e.target.value))
                          }
                          icon={dropDownArrow}
                          placeHolder="Select Mode"
                        />
                      </div>
                    ) : (
                      <DetailField
                        label="Project Handling Mode"
                        value={project.mode_of_project_handling}
                      />
                    )}

                    {editingIndex === index ? (
                      <div className="DetailRightColumn d-flex flex-column">
                        <p className="projectDetailsHeading">Role in Project</p>

                        <SharedDropDown
                          options={ROLE_IN_TEAM}
                          value={roleInProject}
                          onChange={(e) =>
                            setRoleInProject(String(e.target.value))
                          }
                          icon={dropDownArrow}
                          placeHolder="Select Role"
                        />
                      </div>
                    ) : (
                      <DetailField
                        label="Role in Project"
                        value={project.role_in_project}
                      />
                    )}
                  </div>

                  {/* -------- REMARKS (EDITABLE ONLY) -------- */}
                  <div className="DetailRightColumn w-100 mt-4">
                    <p className="projectDetailsHeading m-0 font14">Remarks</p>

                    {editingIndex === index ? (
                      <>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editedRemark}
                          onChange={(e) => setEditedRemark(e.target.value)}
                          className="mt-2"
                        />

                        <div className="d-flex gap-2 mt-2">
                          <SharedButton
                            disabled={isUpdating}
                            onClick={() => handleSave(project)}
                            label="Save"
                          />

                          <SharedButton
                            disabled={isUpdating}
                            variant="outline"
                            onClick={handleCancel}
                            label="Cancel"
                          />
                        </div>
                      </>
                    ) : (
                      <p className="m-0">{project.remarks || '—'}</p>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))
          : !isLoading && (
              <NoRecordFound
                heading="No Project Found"
                description="No projects are currently available. Please add a project."
                className="onlyWithTopSearch"
              />
            )}
      </Accordion>
    </div>
  )
}
