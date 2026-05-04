import { useCallback, useEffect, useState } from 'react'

import { Col, Container, Modal, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import moment from 'moment'

import calendar from '@project/assets/images/Calendar.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import {
  useAddNewEmpCertificationMutation,
  useUpdateEmpCertificationMutation,
} from '@project/Store/Api/Employee/Certification/certificationApi'
import { CertificationFormReq } from '@project/Types/Employee/Certification'
import { showErrorToast } from '@project/Utils/notificationPopup'
import { certificationValidationSchema } from '@project/Utils/validationMessages'

import './Certification.scss'

interface AttachedFile {
  file: File | null
  preview: string
  name: string
}

interface CertificationFormProps {
  show: boolean
  onClose: () => void
  onSuccess: () => void
  editData?: CertificationFormReq | null
}

//  Updated initialValues with Date | null
export const initialValues = {
  id: null,
  name_of_certificate: '',
  subject_name: '',
  topic_name: '',
  certification_start_date: null as Date | null,
  certification_end_date: null as Date | null,
  remarks: '',
  attachment_url: '',
}

export function CertificationForm({
  show,
  onClose,
  onSuccess,
  editData,
}: CertificationFormProps): JSX.Element {
  const [formData, setFormData] = useState(initialValues)
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null)

  const [addCertification, { isLoading: addLoading }] =
    useAddNewEmpCertificationMutation()
  const [updateCertification, { isLoading: updateLoading }] =
    useUpdateEmpCertificationMutation()

  const getAttachmentFallbackUrl = (): string =>
    'https://plus.unsplash.com/premium_photo-1661889099855-b44dc39e88c9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  const handleSubmit = useCallback(
    async (values: typeof initialValues) => {
      try {
        const payload = {
          ...values,
          certification_start_date: values.certification_start_date
            ? moment(values.certification_start_date).toISOString()
            : '',
          certification_end_date: values.certification_end_date
            ? moment(values.certification_end_date).toISOString()
            : '',
          attachment_url: attachedFile
            ? String(getAttachmentFallbackUrl())
            : String(getAttachmentFallbackUrl()),
        }

        if (values.id) {
          await updateCertification({ ...payload, id: values.id }).unwrap()
        } else {
          await addCertification(payload).unwrap()
        }

        onSuccess()
        onClose()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Certification submit failed:', error)
        showErrorToast('Something went wrong')
      }
    },
    [attachedFile, addCertification, updateCertification, onClose, onSuccess]
  )

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        certification_start_date: editData.certification_start_date
          ? new Date(editData.certification_start_date)
          : null,
        certification_end_date: editData.certification_end_date
          ? new Date(editData.certification_end_date)
          : null,
        attachment_url: editData.attachment_url || '',
      })

      if (
        editData.attachment_url &&
        editData.attachment_url !== 'null' &&
        editData.attachment_url !== '[object File]'
      ) {
        setAttachedFile({
          file: null,
          preview: editData.attachment_url,
          name: editData.attachment_url.split('/').pop() || 'uploaded_image',
        })
      } else {
        setAttachedFile(null)
      }
    } else {
      setFormData(initialValues)
      setAttachedFile(null)
    }
  }, [editData])

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      dialogClassName="custom-modal"
    >
      <div className="lightColor">
        <p className="certification-title p-4 m-0">
          {editData ? 'Edit Certification' : 'Add Certification'}
        </p>
      </div>
      <Container fluid className="p-4">
        <div className="certificationFormContainer certificationFormWrapper">
          <Formik
            initialValues={formData}
            enableReinitialize
            validationSchema={certificationValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="certification-form">
                <Row className="g-4">
                  {/* Name of Certification */}
                  <Col xs={12} md={4}>
                    <span className="form-label font14">
                      Name of Certification{' '}
                      <span className="danger customStar">*</span>
                    </span>
                    <Field
                      as={CommonInput}
                      name="name_of_certificate"
                      placeholder="Enter certification name"
                      className={
                        errors.name_of_certificate &&
                        touched.name_of_certificate
                          ? 'is-invalid'
                          : ''
                      }
                    />
                    <ErrorMessage
                      name="name_of_certificate"
                      component="div"
                      className="errorMessage mt-2"
                    />
                  </Col>

                  {/* Subject Name */}
                  <Col xs={12} md={4}>
                    <span className="form-label font14">
                      Subject Name <span className="danger customStar">*</span>
                    </span>
                    <Field
                      as={CommonInput}
                      name="subject_name"
                      placeholder="Enter subject name"
                      className={
                        errors.subject_name && touched.subject_name
                          ? 'is-invalid'
                          : ''
                      }
                    />
                    <ErrorMessage
                      name="subject_name"
                      component="div"
                      className="errorMessage mt-2"
                    />
                  </Col>

                  {/* Topic Name */}
                  <Col xs={12} md={4}>
                    <span className="form-label font14">Topic Name</span>
                    <Field
                      as={CommonInput}
                      name="topic_name"
                      placeholder="Enter topic name"
                      className={
                        errors.topic_name && touched.topic_name
                          ? 'is-invalid'
                          : ''
                      }
                    />
                  </Col>

                  {/* Certification Start Date */}
                  <Col xs={12} md={4}>
                    <span className="form-label font14">
                      Certification Start Date{' '}
                      <span className="danger customStar">*</span>
                    </span>

                    <div className="position-relative w-100 customDatePicker">
                      <DatePicker
                        selected={values.certification_start_date}
                        onChange={(date) =>
                          setFieldValue('certification_start_date', date)
                        }
                        className={`form-control date-input w-100 ${
                          errors.certification_start_date &&
                          touched.certification_start_date
                            ? 'is-invalid'
                            : ''
                        }`}
                        placeholderText="Select start date"
                        dateFormat="dd MMM, yyyy"
                      />
                      <img
                        src={calendar}
                        alt="calendar"
                        className="calendar-icon"
                      />
                    </div>
                    <ErrorMessage
                      name="certification_start_date"
                      component="div"
                      className="errorMessage mt-2"
                    />
                  </Col>

                  {/* Certification End Date */}
                  <Col xs={12} md={4}>
                    <span className="form-label font14">
                      Certification End Date{' '}
                      <span className="danger customStar">*</span>
                    </span>
                    <div className="position-relative w-100 customDatePicker">
                      <DatePicker
                        selected={values.certification_end_date}
                        onChange={(date) =>
                          setFieldValue('certification_end_date', date)
                        }
                        className={`form-control date-input ${
                          errors.certification_end_date &&
                          touched.certification_end_date
                            ? 'is-invalid'
                            : ''
                        }`}
                        placeholderText="Select end date"
                        dateFormat="dd MMM, yyyy"
                        minDate={values.certification_start_date || undefined}
                      />
                      <img
                        src={calendar}
                        alt="calendar"
                        className="calendar-icon"
                      />
                    </div>

                    <ErrorMessage
                      name="certification_end_date"
                      component="div"
                      className="errorMessage mt-2"
                    />
                  </Col>

                  {/* Remarks */}
                  <Col xs={12}>
                    <span className="form-label w-100 font14">Remarks</span>
                    <Field
                      id="remarks"
                      as="textarea"
                      name="remarks"
                      placeholder="Enter remarks"
                      rows={4}
                      className={`form-control w-100 ${
                        errors.remarks && touched.remarks ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="remarks"
                      component="div"
                      className="errorMessage mt-2"
                    />
                  </Col>
                </Row>

                <div className="d-flex gap-3 justify-content-end mt-4">
                  <SharedButton
                    type="button"
                    label="Cancel"
                    onClick={onClose}
                    variant="outline"
                  />
                  <SharedButton
                    type="submit"
                    label={!editData ? 'Add' : 'Update'}
                    variant="primary"
                    loading={!editData ? addLoading : updateLoading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </Modal>
  )
}
