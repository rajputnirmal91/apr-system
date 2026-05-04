import { useEffect, useState } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import noCertificateFound from '@project/assets/images/noCertificateFound.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import { useGetCertificateListQuery } from '@project/Store/Api/Manager'
import { CertificationFormReq } from '@project/Types/Employee/Certification'

import { PedpSavePayload } from '../IrmPedpTab/SrmPedpTab'

import './SrmCertificationsTab.scss'

type Props = {
  onNextTab?: () => void
  onPreview?: () => void
  pedpPayload?: PedpSavePayload | null
}

function IrmCertificationsTab({
  onNextTab,
  onPreview,
  pedpPayload,
}: Props): JSX.Element {
  const [certifications, setCertifications] = useState<CertificationFormReq[]>(
    []
  )
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const { employee_user_id } = useParams<{ employee_user_id: string }>()
  const navigate = useNavigate()

  const {
    data: certificationsData,
    refetch: refetchDetails,
    isLoading: isFetching,
  } = useGetCertificateListQuery(employee_user_id!, {
    skip: !employee_user_id,
    refetchOnMountOrArgChange: true,
  })

  // Refetch on mount
  useEffect(() => {
    refetchDetails()
  }, [refetchDetails])

  // Update certifications list based on API or props
  useEffect(() => {
    if (certificationsData?.certifications) {
      setCertifications(certificationsData.certifications)
    }
  }, [certificationsData])

  const handConfirm = () => {
    setTimeout(() => {
      setShowModal(false)
      setShowPublishModal(false)
      navigate('/irm/irm-dashboard')
    }, 1500)
  }
  const handleClose = () => {
    setShowModal(false)
    setShowPublishModal(false)
    navigate('/irm/irm-dashboard')
  }

  useEffect(() => {
    if (pedpPayload) {
      // eslint-disable-next-line no-console
      console.log(
        'FULL PEDP PAYLOAD RECEIVED IN TAB 3 (CERTIFICATIONS):',
        pedpPayload
      )
    }
  }, [pedpPayload])

  return (
    <div className="certificationListCardWrapper d-flex flex-column">
      {isFetching ? (
        <p className="text-center mt-4">Loading certifications...</p>
      ) : (
        <Accordion
          className="certificationListWrapper w-100 m-0"
          activeKey={activeKey || undefined}
          defaultActiveKey="0"
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
                      {!(activeKey === String(index)) &&
                        cert.attachment_url &&
                        cert.attachment_url !== 'null' &&
                        cert.attachment_url !== '[object File]' && (
                          <img
                            src={cert.attachment_url}
                            alt="Certification"
                            style={{
                              width: '73px',
                              height: '52px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                        )}

                      <div className="d-flex flex-column gap-1">
                        <p className="m-0 fw-normal">
                          {cert.name_of_certificate || 'Untitled'}
                        </p>
                        <p
                          className="m-0 font12"
                          style={{ color: 'var(--textLight)' }}
                        >
                          {cert.subject_name || '—'}
                        </p>
                      </div>
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
                      <p className="text-muted">No image uploaded</p>
                    )}

                    <div className="d-flex flex-wrap DetailsRightWrapper w-100">
                      <div className="DetailRightColumn">
                        <p className="CertifcationDetailHeading">
                          Subject Name
                        </p>
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
            <div className="text-center mt-5 position-relative">
              <img
                src={noCertificateFound}
                alt="No Certifications"
                style={{ maxWidth: '300px' }}
              />
            </div>
          )}
        </Accordion>
      )}
      <div className="d-flex justify-content-start gap-3 mt-auto">
        <SharedButton
          label="Close"
          variant="outline"
          onClick={() => navigate('/irm/irm-dashboard')}
        />
        <SharedButton
          label="Previous"
          variant="outline"
          onClick={() => {
            if (onPreview) onPreview()
          }}
        />

        <SharedButton
          label="Next"
          variant="outline"
          onClick={() => onNextTab?.()}
        />
      </div>

      <CustomModal
        show={showModal || showPublishModal}
        onClose={handleClose}
        onConfirm={handConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Successfully"
        modalDesc={
          showModal
            ? 'Yeah, you are PEDP form save successfully'
            : 'Yeah, you are PEDP form Publish successfully'
        }
        type="Success"
        mode="info"
      />
    </div>
  )
}

export default IrmCertificationsTab
