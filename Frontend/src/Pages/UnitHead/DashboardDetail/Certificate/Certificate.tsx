import { useEffect, useState } from 'react'

import Accordion from 'react-bootstrap/Accordion'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import noCertificateFound from '@project/assets/images/noCertificateFound.svg'
import Spinner from '@project/Common/Spinner'
import { useGetCertificateListQuery } from '@project/Store/Api/UnitHead/UnitHeadApi'
import { CertificationFormReq } from '@project/Types/Employee/Certification'

import './Certificate.scss'

function Certificate(): JSX.Element {
  const [certifications, setCertifications] = useState<CertificationFormReq[]>(
    []
  )
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { employeeUserId } = useParams<{ employeeUserId: string }>()

  const {
    data: certificationsData,
    refetch: refetchDetails,
    isLoading: isFetching,
  } = useGetCertificateListQuery(employeeUserId!, {
    skip: !employeeUserId,
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    refetchDetails()
  }, [refetchDetails])

  useEffect(() => {
    if (certificationsData?.certifications) {
      setCertifications(certificationsData.certifications)
    }
  }, [certificationsData])

  return (
    // <Container>
    <div className="certificationListCardWrapper d-flex flex-column">
      {isFetching ? (
        <p className="text-center mt-4">
          <Spinner />
        </p>
      ) : (
        <Accordion
          className="certificationListWrapper w-100 m-0"
          activeKey={activeKey || undefined}
          onSelect={(key) => setActiveKey((key as string) ?? null)}
          defaultActiveKey="0"
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
    </div>
    // {/* </Container> */}
  )
}

export default Certificate
