import { Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import SharedButton from '@project/Components/Button/SharedButton'
import { useSendBulkEmailMutation } from '@project/Store/Api/Hr/HrEmailTemplateApi'

import { useEmailTemplate } from '../EmailTemplateContext'

function StepReviewSend() {
  const {
    subject,
    body,
    selectedTemplate,
    selectedUsers,
    isSending,
    isSent,
    isSavingDraft,
    draftId,
    setIsSending,
    setIsSent,
    setIsSavingDraft,
    setStep,
    resetFlow,
  } = useEmailTemplate()

  const navigate = useNavigate()
  const [sendBulkEmail] = useSendBulkEmailMutation()

  const buildPayload = (saveAsDraft: boolean) => ({
    id: draftId ?? null,
    email_template_id: selectedTemplate!.value,
    save_as_draft: saveAsDraft,
    recipient: selectedUsers
  })

  const handleSend = async () => {
    if (!selectedTemplate || selectedUsers.length === 0) return
    setIsSending(true)
    try {
      await sendBulkEmail(buildPayload(false)).unwrap()
      setIsSending(false)
      setIsSent(true)
      navigate('/hr/email-template/sent')
    } catch {
      setIsSending(false)
    }
  }

  const handleSaveAsDraft = async () => {
    if (!selectedTemplate || selectedUsers.length === 0) return
    setIsSavingDraft(true)
    try {
      await sendBulkEmail(buildPayload(true)).unwrap()
      setIsSavingDraft(false)
      navigate('/hr/email-template/draft')
    } catch {
      setIsSavingDraft(false)
    }
  }

  if (isSent) {
    return (
      <div className="et-step-container et-sent-success">
        <div className="et-success-box">
          <div className="et-success-icon">✓</div>
          <h5 className="et-success-title font20 font600 fontOnest textDark">
            Email Sent Successfully
          </h5>
          <p className="text-muted font14 fontOnest">
            Your email has been sent to {selectedUsers.length} recipient
            {selectedUsers.length !== 1 ? 's' : ''}.
          </p>
          <SharedButton label="Send Another" variant="primary" onClick={resetFlow} />
        </div>
      </div>
    )
  }

  return (
    <div className="et-step-container w-100">
      <div className="et-panel-card et-review-card et-review-card-scroll">
        <h6 className="et-panel-title font16 font600 fontOnest textDark">Review Email</h6>

        <Row className="mb-3">
          <Col xs={12} md={2}>
            <span className="et-review-label font14 font600 fontOnest">To:</span>
          </Col>
          <Col xs={12} md={10}>
            <div className="et-recipient-tags">
              {selectedUsers.map((email) => (
                <span key={email} className="et-recipient-tag font12 fontOnest textDark" title={email}>
                  {email}
                </span>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={2}>
            <span className="et-review-label font14 font600 fontOnest">Subject:</span>
          </Col>
          <Col xs={12} md={10}>
            <span className="font14 fontOnest textDark">{subject}</span>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={2}>
            <span className="et-review-label font14 font600 fontOnest">Body:</span>
          </Col>
          <Col xs={12} md={10}>
            <div
              className="et-review-body  font14 fontOnest"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </Col>
        </Row>
      </div>

      <div className="et-step-footer">
        <SharedButton
          label="Back"
          variant="outline"
          onClick={() => setStep(2)}
          disabled={isSending || isSavingDraft}
        />
        <SharedButton
          label={isSavingDraft ? 'Saving...' : 'Save as Draft'}
          variant="outline"
          onClick={handleSaveAsDraft}
          loading={isSavingDraft}
          disabled={isSending || isSavingDraft || !selectedTemplate || selectedUsers.length === 0}
        />
        <SharedButton
          label={isSending ? 'Sending...' : 'Send Email'}
          variant="primary"
          onClick={handleSend}
          loading={isSending}
          disabled={isSending || isSavingDraft || !selectedTemplate || selectedUsers.length === 0}
        />
      </div>
    </div>
  )
}

export default StepReviewSend
