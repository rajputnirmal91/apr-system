import Danger from '@project/assets/images/Danger.svg'

import CustomModal from '../Modal'

interface GoalsAlertModalProps {
  show: boolean
  onConfirm: () => void
  onCancel: () => void
  heading?: string
  description?: string
}

export function GoalsAlertModal({
  show,
  onConfirm,
  onCancel,
  heading = 'Discard unsaved changes?',
  description = 'You have unsaved changes. If you continue, they will be lost.',
}: GoalsAlertModalProps) {
  return (
    <CustomModal
      show={show}
      onClose={onCancel}
      onConfirm={onConfirm}
      image={Danger}
      type="Alert"
      modalHeading={heading}
      modalDesc={description}
      mode="confirm"
    />
  )
}
