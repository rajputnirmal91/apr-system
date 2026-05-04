import React, { forwardRef } from 'react'

import './CommonInput.scss'

interface CommonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  width?: string
  height?: string
  name?: string
  type?: string
  id?: string
  className?: string
  disabled?: boolean
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  ref?: React.Ref<HTMLInputElement>
  iconClick?: () => void
}

const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
  (
    {
      label = '',
      placeholder = '',
      value,
      onChange,
      icon,
      width = '100%',
      height = '52px',
      name,
      type = 'text',
      id,
      className = '',
      disabled = false,
      onDragOver,
      onDrop,
      iconClick,
      ...props
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <div
          className={`common-input${disabled ? ' common-input--disabled' : ''}`}
          style={{ width, height }}
        >
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${className}`}
            disabled={disabled}
            onDragOver={onDragOver}
            onDrop={onDrop}
            ref={ref}
            {...props}
          />
          {icon && (
            <span className="input-icon" onClick={iconClick}>
              {icon}
            </span>
          )}
        </div>
      </>
    )
  }
)

export default CommonInput
