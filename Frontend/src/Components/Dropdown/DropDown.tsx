import { Dropdown } from 'primereact/dropdown'

import '@project/Components/Dropdown/DropDown.scss'

type Option = {
  label: string
  value: string | number
}

interface CustomDropdownProps {
  dropdownLabel?: string
  id?: string
  value: string | number
  options: Option[]
  onChange: (e: { target: { value: string | number } }) => void
  placeholder?: string
  append?: HTMLElement | 'self' | (() => HTMLElement) | null
  disabled?: boolean
  filter?: boolean // Enable search/filter inside dropdown
  filterPlaceholder?: string // Placeholder for filter input
}

function CustomDropdown({
  dropdownLabel,
  id,
  value,
  options,
  onChange,
  placeholder = 'Select option',
  append = document.body,
  disabled = false,
  filter = false,
  filterPlaceholder = 'Search...',
}: CustomDropdownProps) {
  return (
    <div className="custom-dropdown">
      {dropdownLabel && (
        <label htmlFor={id} className="input-label">
          {dropdownLabel}
        </label>
      )}
      <Dropdown
        options={options}
        value={value}
        onChange={(e) => {
          // PrimeReact Dropdown onChange passes the entire option object as e.value
          // We need to extract the actual value from the option object
          let actualValue = e.value

          // If e.value is an object (the option object), extract the value property
          if (
            actualValue &&
            typeof actualValue === 'object' &&
            'value' in actualValue
          ) {
            actualValue = actualValue.value
          }

          // Transform it to match the expected format { target: { value } }
          onChange({ target: { value: actualValue } })
        }}
        placeholder={placeholder}
        panelClassName="custom-dropdown-panel1 onest-regular-14"
        appendTo={append}
        disabled={disabled}
        filter={filter}
        filterPlaceholder={filterPlaceholder}
        // showClear={showClear}
        resetFilterOnHide
      />
    </div>
  )
}

export default CustomDropdown
