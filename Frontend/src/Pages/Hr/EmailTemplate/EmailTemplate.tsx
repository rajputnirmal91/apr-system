import { Container } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

import EmailList from './EmailList'
import { EmailTemplateProvider, useEmailTemplate } from './EmailTemplateContext'
import StepIndicator from './StepIndicator'
import StepReviewSend from './steps/StepReviewSend'
import StepTemplateSelect from './steps/StepTemplateSelect'
import StepUserSelect from './steps/StepUserSelect'

import './EmailTemplate.scss'

type EmailTemplateTab = 'new' | 'sent' | 'draft'

interface EmailTemplateProps {
  tab: EmailTemplateTab
}

function NewEmailFlow() {
  const { step } = useEmailTemplate()

  return (
    <div className="et-new-flow">
      <StepIndicator currentStep={step} />
      <div className="et-step-content">
        {step === 1 && <StepTemplateSelect />}
        {step === 2 && <StepUserSelect />}
        {step === 3 && <StepReviewSend />}
      </div>
    </div>
  )
}

function EmailTemplate({ tab }: EmailTemplateProps) {
  const [searchParams] = useSearchParams()
  const draftId = searchParams.get('draftId') ?? undefined

  return (
    <Container fluid className="et-container">
      {tab === 'new' && (
        <EmailTemplateProvider draftId={draftId}>
          <NewEmailFlow />
        </EmailTemplateProvider>
      )}
      {tab === 'sent' && <EmailList type="sent" />}
      {tab === 'draft' && <EmailList type="draft" />}
    </Container>
  )
}

export default EmailTemplate
