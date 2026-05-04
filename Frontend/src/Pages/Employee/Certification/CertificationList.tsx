import { useEffect, useState } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import moment from 'moment'

import deleteBlack from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import CustomModal from '@project/Components/Modal/Modal'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import { TopSearch } from '@project/Components/TopSearch/TopSearch'
import {
  useDeleteEmpCertificationMutation,
  useGetCertificationListQuery,
} from '@project/Store/Api/Employee/Certification/certificationApi'
import { CertificationFormReq } from '@project/Types/Employee/Certification'
import useDebounce from '@project/Utils/debounce'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'

import { CertificationForm } from './CertificationForm'

import './Certification.scss'

type Props = {
  initialValues: CertificationFormReq[]
}

function CertificationList({ initialValues }: Props): JSX.Element {
  const [certifications, setCertifications] = useState<CertificationFormReq[]>(
    []
  )
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState<CertificationFormReq | null>(null)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [globalSearch, setGlobalSearch] = useState<string>('')
  const debouncedSearch = useDebounce(globalSearch, 500)

  // delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const { data: certificationsData, refetch } = useGetCertificationListQuery({
    search: debouncedSearch,
    order_by: 'asc',
  })

  const [deleteCertification, { isLoading: deleteLoading }] =
    useDeleteEmpCertificationMutation()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') {
      setGlobalSearch(e)
    } else {
      setGlobalSearch(e.target.value)
    }
  }

  // Refetch on mount or search
  useEffect(() => {
    refetch()
  }, [debouncedSearch, refetch])

  // Update certifications list
  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      setCertifications(initialValues)
    } else if (certificationsData && certificationsData.certifications) {
      setCertifications(certificationsData.certifications)
    }
  }, [initialValues, certificationsData])

  const handleEdit = (index: number) => {
    const selectedCert = certifications[index]
    setEditData(selectedCert)
    setShowForm(true)
  }

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index)
    setShowDeleteModal(true)
  }

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false)
    setDeleteIndex(null)
  }

  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return
    const certToDelete = certifications[deleteIndex]
    if (!certToDelete?.id) {
      showErrorToast('Something went wrong')
      return
    }

    try {
      await deleteCertification({
        id: certToDelete.id,
        is_deleted: true,
      }).unwrap()

      // Remove from local state
      const updated = certifications.filter((_, i) => i !== deleteIndex)
      setCertifications(updated)
      setDeleteIndex(null)
      setShowDeleteModal(false)
      showSuccessToast('Employee certification deleted successfully')

      refetch()
    } catch (error) {
      showErrorToast(String(error))
      setShowDeleteModal(false)
    }
  }

  return (
    <div>
      <TopSearch
        title="My Certificates"
        searchPlaceholder="Search"
        searchValue={globalSearch}
        onSearchChange={(value) => handleSearch(value)}
        buttonLabel="Add Certificate"
        isToggled={showForm}
        onToggle={(next) => {
          setShowForm(next)
          setEditData(null)
        }}
      />

      <Accordion
        className="certificationListWrapper"
        activeKey={activeKey || undefined}
        onSelect={(key) => setActiveKey((key as string) ?? null)}
      >
        {certifications.length > 0 ? (
          certifications.map((cert, index) => (
            <Accordion.Item
              key={cert.id || index}
              eventKey={String(index)}
              className="mb-3"
            >
              <Accordion.Header className="certificationListHeader">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <div className="d-flex flex-column gap-1">
                      <p className="m-0 fw-normal">
                        {cert.name_of_certificate}
                      </p>
                      <p
                        className="m-0 font12"
                        style={{ color: 'var(--textLight)' }}
                      >
                        {cert.subject_name}
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEdit(index)}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        marginRight: '5px',
                      }}
                      aria-label={`Edit Certification ${index + 1}`}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </button>
                    <div className="vr" />
                    <button
                      onClick={() => handleDeleteClick(index)}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        marginRight: '5px',
                      }}
                      aria-label={`Delete Certification ${index + 1}`}
                    >
                      <img src={deleteBlack} alt="Delete" />
                    </button>
                    <div className="vr" />
                  </div>
                </div>
              </Accordion.Header>

              <Accordion.Body className="certificationListBody">
                <div className="certificationListContent">
                  {cert.attachment_url !== 'null' &&
                  cert.attachment_url !== '[object File]' ? (
                    <img
                      src={cert.attachment_url}
                      alt="Certification"
                      className="attachmentImg"
                    />
                  ) : (
                    'No image uploaded'
                  )}

                  <div
                    className="d-flex flex-wrap DetailsRightWrapper"
                    style={{ width: '100%' }}
                  >
                    <div className="DetailRightColumn">
                      <p className="CertifcationDetailHeading">Subject Name</p>
                      <p>{cert.subject_name || '—'}</p>
                    </div>
                    <div className="DetailRightColumn">
                      <p className="CertifcationDetailHeading">Topic Name</p>
                      <p>{cert.topic_name || '—'}</p>
                    </div>
                    <div className="DetailRightColumn">
                      <p className="CertifcationDetailHeading">Start Date</p>
                      <p>
                        {cert.certification_start_date
                          ? moment(cert.certification_start_date).format(
                              'DD MMM, YYYY'
                            )
                          : '—'}
                      </p>
                    </div>
                    <div className="DetailRightColumn">
                      <p className="CertifcationDetailHeading">End Date</p>
                      <p>
                        {cert.certification_end_date
                          ? moment(cert.certification_end_date).format(
                              'DD MMM, YYYY'
                            )
                          : '—'}
                      </p>
                    </div>

                    <div className="DetailRightColumn">
                      <p className="CertifcationDetailHeading">Remarks</p>
                      <p>{cert.remarks || '—'}</p>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <NoRecordFound
            heading="No certifications"
            description="No certifications added!"
            className="onlyWithTopSearch"
          />
        )}
      </Accordion>

      {showForm && (
        <CertificationForm
          show={showForm}
          onClose={() => {
            setShowForm(false)
            setEditData(null)
          }}
          onSuccess={() => {
            refetch()
            setShowForm(false)
            setEditData(null)
          }}
          editData={editData}
        />
      )}

      <CustomModal
        show={showDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Delete Certification"
        modalDesc="Are you sure you want to delete this Certification?"
        type="Warning"
        mode="confirm"
        loading={deleteLoading}
      />
    </div>
  )
}

export default CertificationList
