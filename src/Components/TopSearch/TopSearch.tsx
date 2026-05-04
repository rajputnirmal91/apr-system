import { useCallback, useMemo, useState } from 'react'

import { Col, Container, Row } from 'react-bootstrap'

import addIcon from '@project/assets/images/AddIcon.png'
import crossIcon from '@project/assets/images/black-cross.svg'
import closeBlackIcon from '@project/assets/images/closeBlackIcon.svg'
import searchDark from '@project/assets/images/searchDark.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'

import SharedButton from '../Button/SharedButton'
import CustomDropdown from '../Dropdown/DropDown'

import './TopSearch.scss'

export interface DropdownOption {
  label: string
  value: string | number
}

export interface DropdownConfig {
  id: string
  options: DropdownOption[]
  placeholder?: string
  value?: string | number
  onChange?: (e: { target: { value: string | number } }) => void
  width?: string
  filter?: boolean
  filterPlaceholder?: string
}

export interface TopSearchProps {
  title?: string

  /** Dropdowns */
  dropdowns?: DropdownConfig[]

  /** Search field */
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchWidth?: string
  disabled?: boolean

  /** Button */
  showButton?: boolean
  buttonLabel?: string
  buttonToggledLabel?: string
  buttonIconSrc?: string
  buttonToggledIconSrc?: string
  buttonWidth?: string
  buttonMinWidth?: string
  buttonMaxWidth?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'lightBlue'
  buttonToggledVariant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'lightBlue'

  /** Toggle control */
  isToggled?: boolean
  onToggle?: (next: boolean) => void

  buttonDisabled?: boolean
  buttonLoading?: boolean
}

export function TopSearch({
  title,
  dropdowns = [],

  showSearch = true,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  searchWidth = '70%',
  disabled = false,
  showButton = true,
  buttonLabel = 'Associate',
  buttonToggledLabel = 'Cancel',
  buttonIconSrc = addIcon,
  buttonToggledIconSrc = closeBlackIcon,
  buttonWidth = '30%',
  buttonMinWidth = '167px',
  buttonMaxWidth = 'max-content',
  buttonVariant = 'primary',
  buttonToggledVariant = 'lightBlue',
  buttonDisabled = false,
  buttonLoading = false,
  isToggled,
  onToggle,
}: TopSearchProps): JSX.Element {
  // Internal fallback toggle state if no external handler provided
  const [internalToggled, setInternalToggled] = useState(false)
  const toggled = isToggled ?? internalToggled

  // Toggle handler (disabled-safe)
  const handleToggle = useCallback(() => {
    if (buttonDisabled) return

    const next = !toggled

    if (onToggle) {
      onToggle(next)
    } else {
      setInternalToggled(next)
    }
  }, [toggled, onToggle, buttonDisabled])

  const currentButtonLabel = useMemo(
    () => (toggled ? buttonToggledLabel : buttonLabel),
    [toggled, buttonLabel, buttonToggledLabel]
  )

  const currentButtonIcon = useMemo(
    () => (toggled ? buttonToggledIconSrc : buttonIconSrc),
    [toggled, buttonIconSrc, buttonToggledIconSrc]
  )

  const currentButtonVariant = useMemo(
    () => (toggled ? buttonToggledVariant : buttonVariant),
    [toggled, buttonVariant, buttonToggledVariant]
  )

  const iconClick = () => {
    if (searchValue.length > 0) {
      onSearchChange?.('')
    }
  }

  return (
    <Container fluid className="mb-3 px-0">
      <Row className="align-items-center mt-3 commonTopSearch">
        {title && (
          <Col xs={12} md={4} className="mb-2 mb-md-0">
            <h5 className="list-title mb-0 fw-normal">{title}</h5>
          </Col>
        )}

        <Col xs={12} md={title ? 8 : 12}>
          <div className="d-flex gap-3 justify-content-md-end flex-wrap customTopBarSearch">
            {/* Dropdowns */}
            {dropdowns.map((dropdown, idx) => (
              <CustomDropdown
                key={dropdown.id || idx}
                id={dropdown.id}
                options={dropdown.options}
                placeholder={dropdown.placeholder || 'Select...'}
                append={document.body}
                value={dropdown.value ?? ''}
                onChange={(e: { target: { value: string | number } }) =>
                  dropdown.onChange?.({
                    target: { value: e.target.value },
                  })
                }
                filter={dropdown?.filter}
                filterPlaceholder={dropdown?.filterPlaceholder}
                // showClear={dropdown?.showClear}
              />
            ))}

            {/* Search */}
            {showSearch && (
              <CommonInput
                className="customSearch"
                placeholder={searchPlaceholder}
                width={searchWidth}
                icon={
                  <img
                    src={searchValue.length > 0 ? crossIcon : searchDark}
                    alt="searchLight"
                  />
                }
                value={searchValue}
                disabled={disabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSearchChange?.(e.target.value)
                }
                iconClick={iconClick}
              />
            )}

            {/* Button */}
            {showButton && (
              <SharedButton
                label={currentButtonLabel}
                style={{
                  width: buttonWidth,
                  minWidth: buttonMinWidth,
                  maxWidth: buttonMaxWidth,
                }}
                icon={currentButtonIcon}
                onClick={handleToggle}
                variant={currentButtonVariant}
                disabled={buttonDisabled}
                loading={buttonLoading}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
