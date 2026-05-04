import { EmailStep } from './EmailTemplateContext'

const STEPS = [
  { step: 1, label: 'Select Template' },
  { step: 2, label: 'Select Recipients' },
  { step: 3, label: 'Review & Send' },
]

function StepIndicator({ currentStep }: { currentStep: EmailStep }) {
  return (
    <div className="et-step-indicator" role="list" aria-label="Email compose steps">
      {STEPS.map(({ step, label }, idx) => {
        const isCompleted = currentStep > step
        const isActive = currentStep === step

        return (
          <div key={step} className="et-step-item" role="listitem">
            <div
              className={`et-step-circle ${isActive ? 'et-step-active' : ''} ${isCompleted ? 'et-step-completed' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? '✓' : step}
            </div>
            <span className={`et-step-label font14 fontOnest ${isActive ? 'et-step-label-active' : ''}`}>
              {label}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`et-step-connector ${isCompleted ? 'et-connector-done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator
