import { useEffect, useState } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

import noCertificationFound from '@project/assets/images/noRecordImg.svg'
import Spinner from '@project/Common/Spinner'
import SharedButton from '@project/Components/Button/SharedButton'
import { useGetManagementEmpCertificateListQuery } from '@project/Store/Api/Management'
import { CertificationFormReq } from '@project/Types/Employee/Certification'
import { managementRoutes } from '@project/Utils/routeNavigation'

import './Certification.scss'

type CertificateProps = {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

function Certificate({ setActiveTab }: CertificateProps): JSX.Element {
  const navigate = useNavigate()
  const [certifications, setCertifications] = useState<CertificationFormReq[]>(
    []
  )
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { employee_user_id } = useParams<{ employee_user_id: string }>()

  const {
    data: certificationsData,

    isLoading,
  } = useGetManagementEmpCertificateListQuery(employee_user_id!, {
    skip: !employee_user_id,
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (certificationsData?.certifications) {
      setCertifications(certificationsData.certifications)
    }
  }, [certificationsData])

  const handleClose = () => {
    navigate(`/${managementRoutes.root}/${managementRoutes.reviewRating}`)
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      {/* <Container> */}
      <div className="certificationListCardWrapper d-flex flex-column">
        <Accordion
          className="certificationListWrapper w-100 m-0"
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
                src={noCertificationFound}
                alt="No Certifications"
                style={{ maxWidth: '300px' }}
              />
              <p className="mt-3 text-muted">No certifications found</p>
            </div>
          )}
        </Accordion>
        <div className="pedpButton pb-4">
          <SharedButton variant="outline" label="Close" onClick={handleClose} />
          <SharedButton
            variant="outline"
            label="Previous"
            onClick={() => setActiveTab('tab2')}
          />
          <SharedButton label="Next" onClick={() => setActiveTab('tab4')} />
        </div>
      </div>
      {/* </Container> */}
    </div>
  )
}

export default Certificate
