import { useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'

import Danger from '@project/assets/images/Danger.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import searchDark from '@project/assets/images/searchDark.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { Kra } from '@project/Types/goalsAssociationTypes'
import { KraListItem } from '@project/Types/kraType'
import useDebounce from '@project/Utils/debounce'

type Props = {
  value: Kra[]
  onSelect: (value: Kra[]) => void
  options: KraListItem[]
  /** Notifies parent when the selection panel opens or closes */
  onOpenChange?: (isOpen: boolean) => void
  onDiscard?: () => void
}

export default function KraDropdown({
  value,
  onSelect,
  options,
  onOpenChange,
  onDiscard,
}: Props) {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Kra[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const openPanel = () => {
    setIsOpen(true)
    onOpenChange?.(true)
  }

  const closePanel = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  // local diff — has the user changed selections vs committed value?
  const hasLocalChanges = () =>
    JSON.stringify(selected.map((s) => s.id).sort()) !==
    JSON.stringify(value.map((v) => v.id).sort())

  const handleChecked = (kra: KraListItem) => {
    if (selected.some((v) => v.id === kra.id)) {
      setSelected((prev) => prev.filter((v) => v.id !== kra.id))
    } else {
      setSelected((prev) => [
        ...prev,
        { id: kra.id, kra_name: kra.kra_name, kra_weightage: 0, sub_kra: [] },
      ])
    }
  }

  useEffect(() => {
    setSelected(value)
  }, [value])

  const normalize = (str?: string) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[-_]/g, '') || ''

  const searchTokens = useMemo(
    () => normalize(debouncedSearchTerm).split(' ').filter(Boolean),
    [debouncedSearchTerm]
  )

  const filteredOptions = useMemo(
    () =>
      options
        .filter((option) => {
          const normalizedKra = normalize(option.kra_name)
          return searchTokens.every((word) => normalizedKra.includes(word))
        })
        .sort((a, b) => a.kra_name.localeCompare(b.kra_name)),
    [options, searchTokens]
  )

  return (
    <>
      <div className="kra-dropdown">
        <div
          className="kra-selector"
          onClick={() => (isOpen ? closePanel() : openPanel())}
        >
          <span style={{ color: '#8E9C9F' }}>Select KRA</span>
          <img src={dropDownArrow} alt="arrow" />
        </div>
      </div>

      {isOpen && (
        <div className="kra-select-panel mt-3 mb-3">
          <div className="p-3 border-bottom">
            <div className="section-title">SELECT KRA</div>
            <CommonInput
              className="customSearch"
              placeholder="Search"
              width="100%"
              icon={<img src={searchDark} alt="searchDark" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border-bottom kraDropdownListItem">
            {filteredOptions.map((option) => {
              const inputId = `kra-${option.id}`
              return (
                <div key={option.id} className="px-3 py-3 selectable-item">
                  <label className="sub-kra-item" htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={selected.some((v) => v.id === option.id)}
                      onChange={() => handleChecked(option)}
                    />
                    <span>{option.kra_name}</span>
                  </label>
                </div>
              )
            })}
            {filteredOptions.length === 0 && (
              <h5 className="p-3 text-center font14 font400 fontOnest primaryColor mb-0">
                No KRA found.
              </h5>
            )}
          </div>

          <div className="d-flex gap-2 p-3">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={() => {
                if (hasLocalChanges()) {
                  setShowDiscardModal(true)
                  return
                }
                closePanel()
                setSelected(value)
              }}
            />
            <SharedButton
              label="Add KRA"
              dataIgnoreGuard
              onClick={() => {
                closePanel()
                onSelect(selected)
                dispatch(setUnsavedChanges(true))
              }}
              disabled={selected.length === 0}
            />
          </div>
        </div>
      )}

      {/* Discard Modal */}
      <CustomModal
        show={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false)
          if (onDiscard) {
            onDiscard()
            return
          }
          closePanel()
          setSelected(value)
        }}
        image={Danger}
        type="Alert"
        modalHeading="Discard unsaved changes?"
        modalDesc="You have unsaved changes. If you continue, they will be lost."
        mode="confirm"
      />
    </>
  )
}
