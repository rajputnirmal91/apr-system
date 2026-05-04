import { Col, Modal, Row } from 'react-bootstrap'

import { HrGetEmailLogByIdResponse } from '@project/Types/Hr/HrEmailTypes'

interface EmailViewModalProps {
  logId: string | null
  data: HrGetEmailLogByIdResponse | null
  onClose: () => void
}

function EmailViewModal({ logId, data, onClose }: EmailViewModalProps) {
  return (
    <Modal
      show={!!logId}
      onHide={onClose}
      centered
      size="xl"
      dialogClassName="et-view-modal-dialog"
    >
      <Modal.Header closeButton className="et-view-modal-header">
        <Modal.Title className="font16 font600 fontOnest textDark">
          Review Email
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="et-view-modal-body">
        <Row className="mb-3 align-items-start">
          <Col xs={3} sm={2}>
            <span className="et-review-label font14 font600 fontOnest">
              To:
            </span>
          </Col>
          <Col xs={9} sm={10}>
            <div className="et-recipient-tags">
              {data?.recipient?.length ? (
                data.recipient.map((email) => (
                  <span
                    key={email}
                    className="et-recipient-tag font12 fontOnest textDark"
                    title={email}
                  >
                    {email}
                  </span>
                ))
              ) : (
                <span
                  className="font14 fontOnest"
                  style={{ color: 'var(--textLight)' }}
                >
                  —
                </span>
              )}
            </div>
          </Col>
        </Row>

        <Row className="mb-3 align-items-start">
          <Col xs={3} sm={2}>
            <span className="et-review-label font14 font600 fontOnest">
              Subject:
            </span>
          </Col>
          <Col xs={9} sm={10}>
            <span className="font14 fontOnest textDark">
              {data?.email_subject ?? '—'}
            </span>
          </Col>
        </Row>

        <Row className="align-items-start">
          <Col xs={3} sm={2}>
            <span className="et-review-label font14 font600 fontOnest">
              Body:
            </span>
          </Col>
          <Col xs={9} sm={10}>
            {data?.email_body ? (
              <div
                className="et-review-body font14 fontOnest"
                dangerouslySetInnerHTML={{ __html: data.email_body }}
              />
            ) : (
              <span
                className="font14 fontOnest"
                style={{ color: 'var(--textLight)' }}
              >
                —
              </span>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default EmailViewModal
