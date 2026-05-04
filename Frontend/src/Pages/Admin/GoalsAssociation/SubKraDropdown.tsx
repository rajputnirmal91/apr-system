/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'

import Danger from '@project/assets/images/Danger.svg'
import deleteDark from '@project/assets/images/deleteDark.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import dropDownArrow from '@project/assets/images/DropDownArrow.svg'
import searchDark from '@project/assets/images/searchDark.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import SharedManageWeightage from '@project/Components/SharedManageWeightage/SharedManageWeightage'
import { setUnsavedChanges } from '@project/Store/Feature/UnsavedChangesGoalsSlice/UnsavedChangesGoalsSlice'
import { SubKra } from '@project/Types/goalsAssociationTypes'
import { SubKraListItem } from '@project/Types/kraType'
import useDebounce from '@project/Utils/debounce'

type Props = {
  value: SubKra[]
  onSelect: (value: SubKra[]) => void
  options: SubKraListItem[]
  kras: { id: string; kra_name: string }[]
  isEditMode?: boolean
  /** Notifies parent when the selection panel opens or closes */
  onOpenChange?: (isOpen: boolean) => void
  /** Called after secondary KRA weightage is saved — parent can collapse the KRA row */
  onSaveComplete?: () => void
}

export default function SubKraDropdown({
  value,
  onSelect,
  options,
  kras,
  isEditMode,
  onOpenChange,
  onSaveComplete,
}: Props) {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<SubKra[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)

  const [deleteKra, setDeleteKra] = useState<any>(null)
  // Holds the list after deletion — used to feed weightage modal before committing
  const [pendingDeleteList, setPendingDeleteList] = useState<SubKra[] | null>(
    null
  )

  const openPanel = () => {
    setIsOpen(true)
    onOpenChange?.(true)
  }

  const closePanel = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  /* -----------------------------------------
   helpers
  ------------------------------------------*/

  const getKraName = (kraId?: string) => {
    if (!kras?.length || !kraId) return 'Unknown KRA'

    return (
      kras.find((k) => String(k.id) === String(kraId))?.kra_name ||
      'Unknown KRA'
    )
  }

  const resolveKraId = (subKra: SubKra): string => {
    if (subKra.kra_id) return subKra.kra_id

    const match = options.find((o) => o.id === subKra.id)

    return match?.kra_id || ''
  }

  const buildWeights = useCallback(
    (items: SubKra[]) => {
      if (!items.length) return []

      const hasDbData = value && value.length > 0

      // -----------------------
      // CREATE MODE
      // -----------------------
      if (!hasDbData) {
        const count = items.length
        const base = Math.floor(100 / count)
        let remainder = 100 - base * count

        return items.map((item) => {
          const extra = remainder > 0 ? 1 : 0
          if (remainder > 0) {
            remainder -= 1
          }

          return {
            id: item.id,
            name: item.sub_kra_name,
            weight: base + extra,
            kra_name: getKraName(item.kra_id),
          }
        })
      }

      // -----------------------
      // EDIT MODE
      // -----------------------
      return items.map((item) => {
        const existing = value.find((v) => v.id === item.id)

        return {
          id: item.id,
          name: item.sub_kra_name,
          weight: existing ? existing.sub_kra_weightage : 0,
          kra_name: getKraName(item.kra_id),
        }
      })
    },
    [value, getKraName]
  )

  const subKraWeightData = useMemo(() => {
    // If a delete is pending, show weightage for the post-deletion list
    return buildWeights(pendingDeleteList ?? selected)
  }, [buildWeights, selected, pendingDeleteList])

  /* -----------------------------------------
   checkbox handler
  ------------------------------------------*/

  const handleChecked = (option: SubKraListItem) => {
    if (selected.some((v) => v.id === option.id)) {
      setSelected((prev) => prev.filter((v) => v.id !== option.id))

      return
    }

    setSelected((prev) => [
      ...prev,
      {
        id: option.id,
        sub_kra_name: option.sub_kra_name,
        sub_kra_weightage: 0,
        kra_id: option.kra_id,
      },
    ])
  }

  /* -----------------------------------------
   normalize incoming value (ADD + EDIT SAFE)
  ------------------------------------------*/

  useEffect(() => {
    if (!value?.length) {
      setSelected([])
      return
    }

    const normalized: SubKra[] = value.map((v) => ({
      ...v,
      kra_id: resolveKraId(v),
    }))

    setSelected(normalized)
  }, [value, options])

  const confirmedSelected: SubKra[] = (value || []).map((v) => ({
    ...v,
    kra_id: resolveKraId(v),
  }))

  /* -----------------------------------------
   filter
  ------------------------------------------*/

  const normalize = (str?: string) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[-_]/g, '') || ''

  const searchTokens = useMemo(
    () => normalize(debouncedSearchTerm).split(' ').filter(Boolean),
    [debouncedSearchTerm]
  )

  const filteredOptions = useMemo(
    () =>
      options.filter((option) => {
        const normalizedSubKra = normalize(option.sub_kra_name)
        return searchTokens.every((word) => normalizedSubKra.includes(word))
      }),
    [options, searchTokens]
  )

  /* -----------------------------------------
   render
  ------------------------------------------*/

  return (
    <div className="bg-white">
      <div className="kra-dropdown mb-3 mt-3" style={{ margin: '10px' }}>
        <div className="section-title">Secondary KRA</div>

        <div
          className="kra-selector"
          onClick={() => (isOpen ? closePanel() : openPanel())}
        >
          <span style={{ color: '#8E9C9F' }}>Select Secondary KRA</span>

          <img src={dropDownArrow} alt="arrow" />
        </div>
      </div>

      {confirmedSelected.length > 0 && (
        <div
          className="m-2"
          style={{
            backgroundColor: 'var(--lightColor)',
            borderRadius: 4,
            border: '1px solid var(--border)',
          }}
        >
          <ol className="m-0">
            {confirmedSelected.map((item) => (
              <li
                key={item.id}
                className="mb-1 savedItemBox"
                style={{ border: 'none', margin: '10px' }}
              >
                <div className="d-flex justify-content-between gap-2">
                  <div className="saved-item-card" style={{ borderRadius: 4 }}>
                    <div className="p-2">
                      {item.sub_kra_name} -{' '}
                      <span className="primaryColor">
                        {item.sub_kra_weightage}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                      }}
                      onClick={() => {
                        setDeleteKra(item)
                        setShowDeleteModal(true)
                      }}
                    >
                      <img src={deleteDark} alt="deleteDark" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {isOpen && (
        <div
          className="kra-select-panel mt-3 mb-3 w-100"
          style={{ maxWidth: '97%', padding: '10px', margin: '10px' }}
        >
          <div className="p-3 border-bottom">
            <div className="section-title">Secondary KRA</div>
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
              const inputId = `sub-kra-${option.id}`

              return (
                <div
                  key={`sub-kra-option${option.id}`}
                  className="selectable-item"
                  style={{ paddingLeft: '1rem' }}
                >
                  <label className="sub-kra-item" htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={selected.some((v) => v.id === option.id)}
                      onChange={() => handleChecked(option)}
                    />
                    <span>{option.sub_kra_name}</span>
                  </label>
                </div>
              )
            })}
            {filteredOptions.length === 0 && (
              <h5 className="p-3 text-center font14 font400 fontOnest primaryColor mb-0">
                No Secondary KRA found.
              </h5>
            )}
          </div>
          <div className="d-flex gap-2  p-3">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={() => {
                const isChanged =
                  JSON.stringify(selected) !== JSON.stringify(confirmedSelected)

                if (isChanged) {
                  setShowDiscardModal(true)
                  return
                }

                closePanel()
                setSelected(confirmedSelected)
              }}
            />
            <SharedButton
              label={isEditMode ? 'Update Secondary KRA' : 'Add Secondary KRA'}
              dataIgnoreGuard
              onClick={() => {
                closePanel()
                setOpenModal(true)
              }}
              disabled={selected.length === 0}
            />
          </div>
        </div>
      )}

      <SharedManageWeightage
        label="Secondary KRA"
        showWeightModal={openModal}
        data={subKraWeightData}
        onSave={(updatedWeights: any) => {
          const updatedList = updatedWeights.map((v: any) => {
            const sourceList = pendingDeleteList ?? selected
            const original = sourceList.find((s) => s.id === v.id)

            return {
              id: v.id || '',
              sub_kra_name: v.name,
              sub_kra_weightage: v.weight,
              kra_id: original?.kra_id,
            }
          })

          dispatch(setUnsavedChanges(true))

          // Commit — this is the single point where parent state is updated
          onSelect(updatedList)
          setSelected(updatedList)
          setPendingDeleteList(null)
          setOpenModal(false)
          closePanel()
          onSaveComplete?.()
        }}
        handleWeightModalClose={() => {
          // User cancelled weightage modal — abort the delete, restore original list
          if (pendingDeleteList) {
            setSelected(confirmedSelected)
            setPendingDeleteList(null)
          }
          setOpenModal(false)
        }}
      />

      {/* DELETE MODAL */}

      <CustomModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteKra(null)
        }}
        image={DeleteWhiteIcon}
        onConfirm={() => {
          if (!deleteKra) return

          const updatedList = confirmedSelected.filter(
            (item) => item.id !== deleteKra.id
          )

          setShowDeleteModal(false)
          setDeleteKra(null)

          if (updatedList.length > 0) {
            // Store pending list and open weightage modal — do NOT commit yet
            setPendingDeleteList(updatedList)
            setSelected(updatedList)
            setOpenModal(true)
          } else {
            // No items left — safe to delete directly, nothing to rebalance
            setSelected(updatedList)
            onSelect(updatedList)
            dispatch(setUnsavedChanges(true))
          }
        }}
        type="Warning"
        modalHeading="Are you sure you want to delete this Secondary KRA?"
        modalDesc="Deleting this Secondary KRA will also remove it from the list. Do you want to proceed?"
        mode="confirm"
      />

      {/* DISCARD MODAL */}

      <CustomModal
        show={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          dispatch(setUnsavedChanges(false))

          setShowDiscardModal(false)
          closePanel()
          setSelected(confirmedSelected)
        }}
        image={Danger}
        type="Alert"
        modalHeading="Discard unsaved changes?"
        modalDesc="You have unsaved changes. If you continue, they will be lost."
        mode="confirm"
      />
    </div>
  )
}
