import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import '@project/Components/SharedDropDown/SharedDropDown.scss'

interface Option {
  label: string
  value: string | number
}

export interface SharedDropDownProps {
  dropdownLabel?: string
  options: Option[]
  icon: string
  value: string | number | null
  onChange: (e: { target: { value: string | number } }) => void
  className?: string
  enableSearch?: boolean
  searchLabel?: string
  placeHolder?: string
  disabled?: boolean

  /**  NEW (Optional) */
  onMenuOpen?: () => void
}

function SharedDropDown({
  dropdownLabel,
  options,
  icon,
  value,
  onChange,
  className,
  enableSearch = false,
  searchLabel,
  placeHolder,
  disabled = false,
  onMenuOpen, //  NEW
}: SharedDropDownProps) {
  const instanceId = useRef(
    `shared-dropdown-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
    visibility: 'hidden',
  })

  const inputId = 'shared-dropdown-input'
  const listboxId = 'shared-dropdown-listbox'

  const handleSelect = (val: string | number) => {
    if (disabled) return
    onChange({ target: { value: val } })
    setOpen(false)
    setSearch('')
  }

  const selectedLabel = options.find((opt) => opt.value === value)?.label || ''

  const filteredOptions = enableSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  useEffect(() => {
    if (typeof document === 'undefined') return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const clickedInsideTrigger = ref.current?.contains(target)
      const clickedInsideList = listRef.current?.contains(target)

      if (!clickedInsideTrigger && !clickedInsideList) {
        setOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOtherDropdownOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>
      if (customEvent.detail?.id !== instanceId.current) {
        setOpen(false)
        setSearch('')
      }
    }

    window.addEventListener('shared-dropdown-open', handleOtherDropdownOpen)

    return () => {
      window.removeEventListener(
        'shared-dropdown-open',
        handleOtherDropdownOpen
      )
    }
  }, [])

  //  Trigger onMenuOpen ONLY when dropdown opens
  useEffect(() => {
    if (open && onMenuOpen) {
      onMenuOpen()
    }
  }, [open, onMenuOpen])

  useLayoutEffect(() => {
    if (!open || typeof window === 'undefined') return

    // Keep the portal hidden until we measure and position it.
    setMenuStyle({ visibility: 'hidden' })

    const updatePosition = () => {
      const inputEl = inputRef.current
      if (!inputEl) return

      const rect = inputEl.getBoundingClientRect()
      const listEl = listRef.current
      const listHeight = listEl?.offsetHeight ?? 140
      const viewportHeight = window.innerHeight
      const spaceAbove = rect.top - 8
      const spaceBelow = viewportHeight - rect.bottom - 8

      const forceDropUp = className?.includes('shared-dropdown--dropup')
      const shouldDropUp =
        forceDropUp || (spaceBelow < listHeight && spaceAbove > spaceBelow)

      const nextTop = shouldDropUp
        ? Math.max(8, rect.top - 8 - listHeight)
        : Math.min(rect.bottom + 8, viewportHeight - listHeight - 8)

      setMenuStyle({
        position: 'fixed',
        top: nextTop,
        left: rect.left,
        width: rect.width,
        zIndex: 30001,
        visibility: 'visible',
      })
    }

    // Allow list to render before measuring
    const raf = requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    // eslint-disable-next-line consistent-return
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, className, filteredOptions.length])

  return (
    <>
      {dropdownLabel && (
        <label
          className="shared-dropdown__label onest-regular-14 mb-2"
          htmlFor={inputId}
        >
          {dropdownLabel}
        </label>
      )}

      <div
        className={`shared-dropdown ${
          className ? ` ${className}` : ''
        } ${disabled ? 'shared-dropdown--disabled' : ''}`}
        ref={ref}
      >
        <div
          id={inputId}
          className={`shared-dropdown__input
            ${open ? 'shared-dropdown__input--open' : ''}
            ${
              value
                ? 'shared-dropdown__input--selected'
                : 'shared-dropdown__input--placeholder'
            }
            ${disabled ? 'shared-dropdown__input--disabled' : ''}
          `}
          onClick={() => {
            if (disabled) return

            setOpen((prev) => {
              const next = !prev

              if (next && typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('shared-dropdown-open', {
                    detail: { id: instanceId.current },
                  })
                )
              }

              return next
            })
          }}
          data-testid="dropdown-input"
          role="combobox"
          aria-expanded={disabled ? false : open}
          aria-controls={listboxId}
          tabIndex={disabled ? -1 : 0}
          ref={inputRef}
        >
          <span className="shared-dropdown__selected-label">
            {selectedLabel || placeHolder || 'Select goal type'}
          </span>

          <img
            src={icon}
            alt="dropdown arrow"
            className={`shared-dropdown__icon ${
              open ? 'shared-dropdown__icon--open' : ''
            } ${disabled ? 'shared-dropdown__icon--disabled' : ''}`}
          />
        </div>

        {open &&
          !disabled &&
          typeof document !== 'undefined' &&
          createPortal(
            <ul
              id={listboxId}
              className="shared-dropdown__list"
              data-testid="dropdown-list"
              role="listbox"
              ref={listRef}
              style={menuStyle}
            >
              {enableSearch && (
                <li className="shared-dropdown__search">
                  {searchLabel && (
                    <label
                      htmlFor={inputId}
                      className="shared-dropdown__search-label"
                    >
                      {searchLabel}
                    </label>
                  )}
                  <input
                    id={`${inputId}-search`}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="shared-dropdown__search-input"
                  />
                </li>
              )}

              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className={`shared-dropdown__option ${
                      value === opt.value
                        ? 'shared-dropdown__option--selected'
                        : ''
                    }`}
                    onClick={() => handleSelect(opt.value)}
                    role="option"
                    aria-selected={value === opt.value}
                  >
                    {opt.label}
                  </li>
                ))
              ) : (
                <li className="shared-dropdown__option d-flex justify-content-center align-items-center center-text">
                  No results found
                </li>
              )}
            </ul>,
            document.body
          )}
      </div>
    </>
  )
}

export default SharedDropDown
