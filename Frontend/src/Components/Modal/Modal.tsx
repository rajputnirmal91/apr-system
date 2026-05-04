import { Modal } from 'react-bootstrap'

import SharedButton from '@project/Components/Button/SharedButton'

import './Modal.scss'

interface CustomModalProps {
  show: boolean
  onClose: () => void
  onConfirm?: () => void
  image?: string
  type: 'Success' | 'Warning' | 'Alert'
  modalHeading: string
  modalDesc: string
  loading?: boolean
  mode?: 'info' | 'confirm'
}

function CustomModal({
  show,
  onClose,
  onConfirm,
  image,
  type,
  modalHeading,
  modalDesc,
  loading,
  mode = 'confirm',
}: CustomModalProps) {
  if (!show) return null
  let modalClass = 'warning'

  switch (type) {
    case 'Success':
      modalClass = 'success'
      break
    case 'Alert':
      modalClass = 'alert'
      break
    default:
      modalClass = 'warning'
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName="custom-modal-dialog"
    >
      <div className="modal-box">
        <div className={`modal-image ${modalClass}`}>
          <img src={image} alt="modal-icon" className="image" />
        </div>

        <h2 className="modal-title font24 font600 fontOnest">{modalHeading}</h2>

        <p className="modal-text font16 font400 fontOnest">{modalDesc}</p>

        <hr className="modal-divider" />

        <div
          className={`modal-actions ${
            mode === 'info' ? 'justify-center' : 'justify-between'
          }`}
        >
          {mode === 'confirm' ? (
            <>
              <SharedButton
                classname="modal-btn"
                label="No"
                variant="outline"
                dataIgnoreGuard
                onClick={onClose}
              />

              {loading}

              <SharedButton
                classname="modal-btn"
                label="Yes"
                variant="primary"
                dataIgnoreGuard
                onClick={onConfirm}
              />
            </>
          ) : (
            <SharedButton
              classname="modal-btn"
              label="OK"
              variant="primary"
              dataIgnoreGuard
              onClick={onClose}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default CustomModal
