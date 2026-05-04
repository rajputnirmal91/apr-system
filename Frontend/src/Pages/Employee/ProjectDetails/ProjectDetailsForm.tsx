import { useMemo, useState } from 'react'

import { Col, Container, Form, Modal, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { ErrorMessage, Field, Form as FormikForm, Formik } from 'formik'

import calendar from '@project/assets/images/Calendar.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import SharedDropDown from '@project/Components/SharedDropDown/SharedDropDown'
import { validationSchema } from '@project/Utils/validationMessages'

import 'react-datepicker/dist/react-datepicker.css'

/* ---------- TYPES ---------- */
export interface ProjectDetailsFormValues {
  employeeStatus: string
  employeeStatusOther: string
  nameOfProject: string
  clientName: string
  mode: string
  role: string
  immediateManager: string
  secondaryManager: string
  clientManager: string
  remarks: string
}

interface ProjectDetailsFormProps {
  showForm: boolean
  onClose: () => void
  onSubmit: (
    data: ProjectDetailsFormValues & {
      startDate: Date | null
      endDate: Date | null
    }
  ) => void
  initialData?: ProjectDetailsFormValues & {
    startDate?: Date | null
    endDate?: Date | null
  }
}

/* ---------- CONSTANT OPTIONS (outside component to prevent re-creation) ---------- */
const EMPLOYEE_STATUS_OPTIONS = ['Billable', 'Non-Billable', 'Other']
const PROJECT_OPTIONS = ['Deliva', 'Appraisal System', 'On24', 'MyKai']
const CLIENT_OPTIONS = ['Infosys', 'Wipro', 'TCS', 'Cognizant']
const MODE_OPTIONS = ['Remote', 'Hybrid', 'Onsite']
const ROLE_OPTIONS = ['Developer', 'Tester', 'Manager']
const MANAGER_OPTIONS = [
  'Amit Sharma',
  'Priya Singh',
  'Rahul Verma',
  'Sneha Rao',
]

const DROPDOWN_FIELDS = [
  { name: 'nameOfProject', label: 'Name of Project', options: PROJECT_OPTIONS },
  { name: 'clientName', label: 'Client Name', options: CLIENT_OPTIONS },
  { name: 'mode', label: 'Mode of Project Handling', options: MODE_OPTIONS },
  { name: 'role', label: 'Role in Project', options: ROLE_OPTIONS },
  {
    name: 'immediateManager',
    label: 'Immediate Reporting Manager',
    options: MANAGER_OPTIONS,
  },
  {
    name: 'secondaryManager',
    label: 'Secondary Reporting Manager',
    options: MANAGER_OPTIONS,
  },
  {
    name: 'clientManager',
    label: 'Client Reporting Manager',
    options: MANAGER_OPTIONS,
  },
]

/* ---------- REUSABLE COMPONENTS ---------- */
function CustomDatePicker({
  label,
  selected,
  onChange,
  minDate,
}: {
  label: string
  selected: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date | null
}) {
  return (
    <div className="mb-4">
      <Form.Label className="mb-0">{label}</Form.Label>
      <div className="position-relative w-100 customDatePicker">
        <DatePicker
          selected={selected || undefined}
          onChange={onChange}
          dateFormat="dd MMM, yyyy"
          placeholderText={`Choose ${label}`}
          className="form-control w-100 mt-1 customDetailsInput"
          minDate={minDate || undefined}
        />
        <img src={calendar} alt="calendar" className="calendar-icon" />
      </div>
    </div>
  )
}

function FormDropdown({
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  name: string
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (e: { target: { value: string | number } }) => void
}) {
  return (
    <div className="mb-4">
      <SharedDropDown
        dropdownLabel={label}
        className="w-100"
        placeHolder={placeholder}
        icon={dropDownArrow}
        value={value}
        onChange={onChange}
        options={options.map((opt) => ({ label: opt, value: opt }))}
      />
      <ErrorMessage name={name} component="div" className="text-danger mt-1" />
    </div>
  )
}

/* ---------- MAIN COMPONENT ---------- */
export default function ProjectDetailsForm({
  showForm,
  onClose,
  onSubmit,
  initialData,
}: ProjectDetailsFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    initialData?.startDate || null
  )
  const [endDate, setEndDate] = useState<Date | null>(
    initialData?.endDate || null
  )

  const initialValues = useMemo<ProjectDetailsFormValues>(
    () =>
      initialData || {
        employeeStatus: '',
        employeeStatusOther: '',
        nameOfProject: '',
        clientName: '',
        mode: '',
        role: '',
        immediateManager: '',
        secondaryManager: '',
        clientManager: '',
        remarks: '',
      },
    [initialData]
  )

  const handleSubmit = (values: ProjectDetailsFormValues) => {
    const payload = {
      ...values,
      employeeStatus:
        values.employeeStatus === 'Other'
          ? values.employeeStatusOther
          : values.employeeStatus,
      startDate,
      endDate,
    }
    onSubmit(payload)
  }

  return (
    <Modal
      show={showForm}
      onHide={onClose}
      centered
      size="lg"
      dialogClassName="ProjectDetailsFormModel"
    >
      <div className="lightColor p-4">
        <h5 className="m-0">Project Details</h5>
      </div>

      <Container fluid className="p-4 projectDetailsFormWrapper">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isValid, dirty }) => (
            <FormikForm>
              {/* Employee Status */}
              <Row>
                <Col xs={12} md={4}>
                  <FormDropdown
                    name="employeeStatus"
                    label="Employee Status"
                    placeholder="Select Status"
                    options={EMPLOYEE_STATUS_OPTIONS}
                    value={values.employeeStatus}
                    onChange={(e) => {
                      const val = e.target.value
                      setFieldValue('employeeStatus', val)
                      if (val !== 'Other')
                        setFieldValue('employeeStatusOther', '')
                    }}
                  />
                </Col>

                {values.employeeStatus === 'Other' && (
                  <Col xs={12} md={8}>
                    <CommonInput
                      label="Others; Please specify"
                      name="employeeStatusOther"
                      placeholder="Please specify"
                      value={values.employeeStatusOther}
                      onChange={(e) =>
                        setFieldValue('employeeStatusOther', e.target.value)
                      }
                    />
                    <ErrorMessage
                      name="employeeStatusOther"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </Col>
                )}
              </Row>

              {/* Dropdown Fields */}
              <Row>
                {DROPDOWN_FIELDS.map((field) => (
                  <Col xs={12} md={4} key={field.name}>
                    <FormDropdown
                      name={field.name}
                      label={field.label}
                      placeholder={`Select ${field.label}`}
                      options={field.options}
                      value={
                        values[
                          field.name as keyof ProjectDetailsFormValues
                        ] as string
                      }
                      onChange={(e) =>
                        setFieldValue(field.name, e.target.value)
                      }
                    />
                  </Col>
                ))}

                {/* Date Fields */}
                <Col xs={12} md={4}>
                  <CustomDatePicker
                    label="Project Start Date"
                    selected={startDate}
                    onChange={setStartDate}
                  />
                </Col>
                <Col xs={12} md={4}>
                  <CustomDatePicker
                    label="Project End Date"
                    selected={endDate}
                    onChange={setEndDate}
                    minDate={startDate}
                  />
                </Col>
              </Row>

              {/* Remarks */}
              <Row>
                <Col xs={12} className="mb-4">
                  <Form.Label className="mb-1">Remarks</Form.Label>
                  <Field
                    as="textarea"
                    name="remarks"
                    rows={4}
                    className="form-control customDetailsInput"
                    placeholder="Please add remarks"
                  />
                </Col>
              </Row>

              <hr className="formDivider" />

              {/* Buttons */}
              <div className="d-flex justify-content-start gap-3 mt-4">
                <SharedButton
                  type="button"
                  label="Cancel"
                  onClick={onClose}
                  variant="outline"
                />
                <SharedButton
                  type="submit"
                  label="Add"
                  variant="primary"
                  disabled={!isValid || !dirty}
                />
              </div>
            </FormikForm>
          )}
        </Formik>
      </Container>
    </Modal>
  )
}
