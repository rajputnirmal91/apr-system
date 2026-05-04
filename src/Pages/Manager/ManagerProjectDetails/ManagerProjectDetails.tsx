import { useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'

import AlertIcon from '@project/assets/images/AlertIcon.svg'
import ArrowLeft from '@project/assets/images/ArrowLeft.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import draft from '@project/assets/images/draft.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import profilePic from '@project/assets/images/profilePic.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'

import './ManagerProjectDetails.scss'

interface ManagerProjectDetailsProps {
  onClose: () => void
}

function ManagerProjectDetails({ onClose }: ManagerProjectDetailsProps) {
  const [showModal, setShowModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [stateUpdate, setStateUpdate] = useState('Pending')
  const [activeKey, setActiveKey] = useState<string | null>('0')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')

  // Single state for all form data
  const [formData, setFormData] = useState({
    employeeId: 'LMS001',
    employeeName: 'Bently Brown',
    designation: 'UI/UX Designer',
    project: 'Run’N Shoot',
    roleInProject: 'Designer',
    workDesignation: 'As a Designer for a sports project...',
    employeeRemarks:
      'As a UI/UX Designer for a sports application, I focus on crafting intuitive and visually appealing interfaces that elevate the experience for both athletes and fans. I work hand-in-hand with developers and stakeholders to ensure our designs meet project objectives, emphasizing usability and style. My role also involves user research to grasp audience needs, prototyping creative solutions, and refining designs based on user feedback to create a product that truly connects with sports lovers.',
    rating: '' as string | number,
    remarks: '',
    status: 'Pending',
  })

  const ratingOption = Array.from({ length: 9 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }))

  // Returns an object with validity and messages
  const validateForm = () => {
    const errors: { rating?: string; remarks?: string } = {}

    if (!formData.rating || formData.rating === '') {
      errors.rating = 'Please select a Rating.'
    }

    if (!formData.remarks || formData.remarks.trim() === '') {
      errors.remarks = 'Please enter Remarks.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  const validation = validateForm()

  const handleShowModal = () => setShowModal(true)
  const handleShowPublishModal = () => setShowPublishModal(true)

  const handleDeleteConfirm = () => {
    setDeleteLoading(true)
    setTimeout(() => {
      setDeleteLoading(false)
      setShowModal(false)
      setShowPublishModal(false)
    }, 1500)
  }

  // Send payload with all fields
  const handleAdd = () => {
    const updatedFormData = {
      ...formData,
      status: 'Draft',
    }

    setFormData(updatedFormData)
    setStateUpdate('Draft')
    setActiveKey(null)
  }

  const handleCancel = () => {
    setActiveKey(null)
  }

  return (
    <Container fluid className="h-100 managerProjectDetailsContainer">
      <button
        onClick={onClose}
        className="transparentButton mb-3 d-flex align-items-center"
      >
        <img src={ArrowLeft} alt="Back" className="me-2" />
        <span className="font14 font400 fontOnest">Back</span>
      </button>
      {/* === Project Summary Section === */}
      <div className="projectSummaryCard pb-0 mb-4">
        <div>
          <div className="p-3 m-0">
            <p className="m-0 px-2 py-1">{formData.project}</p>
          </div>

          <div className="projectDetailsGrid whiteBg m-0 p-3">
            <div>
              <p className="textLight font14 mb-1">Client Name</p>
              <p className="textDark mb-0">Hailee Best</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">Start Date</p>
              <p className="textDark mb-0">24 Jan 2024</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">End Date</p>
              <p className="textDark mb-0">01 Dec 2025</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">Employee Strength</p>
              <p className="textDark mb-0">08</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">Received Appraisal Form</p>
              <p className="textDark mb-0">05</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">Reviewed Appraisal Form</p>
              <p className="textDark mb-0">02</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">Pending Appraisal Form</p>
              <p className="textDark mb-0">03</p>
            </div>
            <div>
              <p className="textLight font14 mb-1">Status</p>
              <p
                className="d-flex align-items-center gap-2"
                style={{ marginRight: '6px' }}
              >
                <img
                  src={stateUpdate === 'Pending' ? AlertIcon : draft}
                  alt={stateUpdate === 'Pending' ? 'AlertIcon' : 'DraftIcon'}
                />
                <span>{stateUpdate}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === Employee List Section === */}

      <TopSearch
        title="Employees"
        showButton={false}
        dropdowns={[
          {
            id: 'department',
            options: [
              { label: 'All Departments', value: '' },
              { label: 'HR', value: 'hr' },
              { label: 'Finance', value: 'finance' },
              { label: 'Engineering', value: 'engineering' },
            ],
            placeholder: 'Select Department',
            value: selectedDepartment,
            onChange: (e) => setSelectedDepartment(e.target.value as string),
            width: '200px',
          },
        ]}
      />

      {/* === Accordion Section === */}
      <div className="accordionSectionWrapper mb-4">
        <Accordion
          activeKey={activeKey}
          onSelect={(key) => {
            if (typeof key === 'string' || key === null) {
              setActiveKey(key)
            }
          }}
          className="managerProjectDetailsAccordion"
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className="d-flex align-items-center justify-content-center gap-2">
                {/* <img src={profilePic} alt="" /> */}
                {activeKey === null && <img src={profilePic} alt="Profile" />}

                <div>
                  <p className="m-0 textDark mb-0">{formData.employeeName}</p>
                  <p className="m-0 textLight font12">
                    {activeKey === null && formData.designation}
                  </p>
                </div>
              </div>
              <div
                className="d-flex gap-2"
                onClick={(e) => e.stopPropagation()}
                style={{ position: 'absolute', right: '60px' }}
              >
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ marginRight: '6px' }}
                >
                  <img
                    src={stateUpdate === 'Pending' ? AlertIcon : draft}
                    alt={stateUpdate === 'Pending' ? 'AlertIcon' : 'DraftIcon'}
                  />
                  <span>{stateUpdate}</span>
                </div>

                {stateUpdate === 'Reviewed' && (
                  <>
                    <div className="vr" />
                    <button
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        marginRight: '5px',
                      }}
                      onClick={() => setActiveKey('0')}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </button>
                  </>
                )}

                <div className="vr" />
              </div>
            </Accordion.Header>

            <Accordion.Body>
              <div className="accordionContentWrapper">
                <div className="accordionContentLeft">
                  <img src={profilePic} alt="" />
                </div>

                <div className="accordionContentRight">
                  <Row className="mb-3">
                    <Col lg={2}>
                      <p className="textLight font14 mb-1">Employee ID</p>
                      <p className="textDark mb-0">{formData.employeeId}</p>
                    </Col>
                    <Col lg={2}>
                      <p className="textLight m-0">Designation</p>
                      <p className="textDark mb-0">{formData.designation}</p>
                    </Col>
                    <Col lg={2}>
                      <p className="textLight m-0">IRM</p>
                      <p className="textDark mb-0">Tenley Garrison</p>
                    </Col>
                    <Col lg={3}>
                      <p className="textLight m-0">Email Id</p>
                      <p className="textDark mb-0">phoebe.sargent@lmsin.com</p>
                    </Col>
                    <Col lg={3}>
                      <p className="textLight m-0">Mobile no.</p>
                      <p className="textDark mb-0">+91 123 456 6789</p>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col lg={2}>
                      <p className="textLight m-0">Role in Project</p>
                      <p className="textDark mb-0">{formData.roleInProject}</p>
                    </Col>
                    <Col lg={10}>
                      <p className="textLight m-0">Work Designation</p>
                      <p className="textDark mb-0">
                        {formData.workDesignation}
                      </p>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col lg={2}>
                      <p className="textLight m-0">Rating by employee</p>
                      <p className="textDark mb-0">4</p>
                    </Col>
                    <Col lg={10}>
                      <p className="textLight m-0">Remark by employee</p>
                      <p className="textDark mb-0">
                        {formData.employeeRemarks}
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>

              <hr style={{ color: 'var(--primary)' }} />

              <div className="bottomProjectDetailsForm">
                <p className="primaryColor">Review by Manager</p>
                <Row>
                  <Col lg={3}>
                    <SharedDropDown
                      dropdownLabel="Select Rating"
                      options={ratingOption}
                      value={formData.rating}
                      onChange={(e: { target: { value: string | number } }) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: e.target.value,
                        }))
                      }
                      icon={dropDownArrow}
                    />
                    {validation.errors.rating && (
                      <p className="text-danger font14 mt-1">
                        {validation.errors.rating}
                      </p>
                    )}
                  </Col>
                  <Col lg={9}>
                    <CommonInput
                      placeholder="Please Remarks"
                      label="Remarks"
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          remarks: e.target.value,
                        }))
                      }
                    />
                    {validation.errors.remarks && (
                      <p className="text-danger font14 mt-1">
                        {validation.errors.remarks}
                      </p>
                    )}
                  </Col>
                </Row>
              </div>

              <hr style={{ color: 'var(--primary)' }} />
              <div className="d-flex gap-2">
                <SharedButton
                  label="Cancel"
                  variant="outline"
                  onClick={handleCancel}
                />
                <SharedButton
                  label="Add"
                  onClick={handleAdd}
                  disabled={!validation.isValid}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="projectDetailBottomBtn d-flex gap-3 mt-auto">
        <SharedButton label="Close" variant="outline" onClick={onClose} />
        <SharedButton
          label="Save"
          onClick={handleShowModal}
          disabled={!validation.isValid}
        />
        <SharedButton
          label="Publish"
          onClick={handleShowPublishModal}
          disabled={!validation.isValid}
        />
      </div>

      <CustomModal
        show={showModal || showPublishModal}
        onClose={onClose}
        onConfirm={handleDeleteConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Successfully"
        modalDesc={
          showModal
            ? 'Yeah, you are PEDP form save successfully'
            : 'Yeah, you are PEDP form Publish successfully'
        }
        type="Success"
        mode="info"
        loading={deleteLoading}
      />
    </Container>
  )
}

export default ManagerProjectDetails
