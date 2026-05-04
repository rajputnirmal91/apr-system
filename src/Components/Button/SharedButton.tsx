import React from 'react'

import './Button.scss'

interface CommonButtonProps {
  label: string
  onClick?: () => void
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'lightBlue'
  fullWidth?: boolean
  disabled?: boolean
  dataIgnoreGuard?: boolean
  classname?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  loading?: boolean
}

function SharedButton({
  label,
  onClick,
  icon,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  dataIgnoreGuard = false,
  classname = '',
  style = {},
  children,
  loading = false,
}: CommonButtonProps): React.ReactElement {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`common-button ${variant} ${fullWidth ? 'full-width' : ''} ${classname}`}
      disabled={disabled}
      style={style}
      data-ignore-guard={dataIgnoreGuard ? 'true' : undefined}
    >
      {children}
      {icon && <img src={icon} alt="icon" className="sharedBtnIcon" />}
      <span className="onest-bold-16">
        {loading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          ''
        )}
        {label}
      </span>
    </button>
  )
}

export default SharedButton
