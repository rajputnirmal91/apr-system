import { useEffect, useRef, useState } from 'react'

import { Modal } from 'react-bootstrap'

import addIcon from '@project/assets/images/AddIcon.png'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CrossIcon from '@project/assets/images/CrossTick.svg'
import DeleteIcon from '@project/assets/images/DeleteBlack.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import RightTick from '@project/assets/images/RightTick.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useAddNewKraMutation,
  useGetKraListQuery,
  useUpdateKraMutation,
} from '@project/Store/Api/Admin/Kra'
import { KraUpdateRequest } from '@project/Types/kraType'
import { normalize } from '@project/Utils'

import './kra.scss'

type SubKraType =
  | string
  | {
      id: string
      kra_id: string
      sub_kra_name: string
      is_associated: boolean
    }

type SubKra = {
  id: string
  kra_id: string
  sub_kra_name: string
}

type FormData = {
  id: string
  kra_name: string
  sub_kras: SubKra[]
}

type KraFormProps = {
  kraFormLabel?: string
  closeForm?: () => void
  editId?: string
  refetch?: () => void
  show: boolean
}

function KraForm({
  kraFormLabel,
  closeForm,
  editId,
  refetch,
  show,
}: KraFormProps) {
  const [kraName, setKraName] = useState<string>('')
  const [subKraList, setSubKraList] = useState<SubKraType[]>([])
  const [addNewKra, { isLoading: addKraLoading }] = useAddNewKraMutation()
  const { data, refetch: listDataRefetch } = useGetKraListQuery({
    page: 1,
    limit: 1000,
    search: '',
  })
  const [formData, setFormData] = useState<FormData | undefined>(undefined)
  const [updateKra, { isLoading: updateKraLoading }] = useUpdateKraMutation()
  const [kraError, setKraError] = useState('')
  const [subKraErrors, setSubKraErrors] = useState<string[]>([])
  const [subKraListError, setSubKraListError] = useState('')
  const [cancelForm, setCancelForm] = useState<boolean>(false)
  const [subKraPopup, setSubKraPopup] = useState<boolean>(false)
  const [isSecondaryEditing, setIsSecondaryEditing] = useState<boolean>(false)
  const [editableSubKras, setEditableSubKras] = useState<boolean[]>([])
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null)
  const subKraInputRefs = useRef<Array<HTMLDivElement | null>>([])
  const ignoreBlurIndex = useRef<number | null>(null)
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const [subKraOriginals, setSubKraOriginals] = useState<
    Record<number, string>
  >({})
  const [newSubKraFlags, setNewSubKraFlags] = useState<boolean[]>([])
  const [showDeleteSubKraConfirm, setShowDeleteSubKraConfirm] =
    useState<boolean>(false)
  const [pendingDeleteSubKra, setPendingDeleteSubKra] =
    useState<SubKraType | null>(null)
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null
  )
  const [showCancelSubKraConfirm, setShowCancelSubKraConfirm] =
    useState<boolean>(false)
  const [pendingCancelIndex, setPendingCancelIndex] = useState<number | null>(
    null
  )

  const buildSubKraErrors = (
    list: SubKraType[],
    options?: { includeRequired?: boolean }
  ) => {
    const includeRequired = options?.includeRequired ?? false
    const errors = Array(list.length).fill('') as string[]
    const normalizedValues = list.map((item) =>
      normalize(typeof item === 'string' ? item : item.sub_kra_name)
    )

    const counts = normalizedValues.reduce<Record<string, number>>(
      (acc, value) => {
        if (!value) return acc
        acc[value] = (acc[value] || 0) + 1
        return acc
      },
      {}
    )

    normalizedValues.forEach((value, index) => {
      if (!value) {
        if (includeRequired) {
          errors[index] = 'Secondary KRA name is required'
        }
        return
      }
      if (counts[value] > 1) {
        errors[index] = 'This Secondary KRA already exists in this form'
      }
    })

    return errors
  }

  useEffect(() => {
    if (kraFormLabel === 'Edit KRA') {
      const formDataById = data?.kras.find((item) => item.id === editId)
      if (formDataById) {
        setFormData(formDataById)
      }
      setKraName(formDataById?.kra_name || '')
      const nextList = formDataById?.sub_kras || []
      setSubKraList(nextList)
      setSubKraErrors(buildSubKraErrors(nextList))
      setEditableSubKras(
        (formDataById?.sub_kras || []).map((item) => !item.sub_kra_name?.trim())
      )
      setNewSubKraFlags((formDataById?.sub_kras || []).map(() => false))
      setSubKraListError('')
    }
  }, [data?.kras, editId, kraFormLabel])

  useEffect(() => {
    if (!show) return
    setSubKraErrors([])
    setSubKraListError('')
    setActiveEditIndex(null)
    setIsSecondaryEditing(false)
  }, [show])

  const handleKraName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setKraName(value)

    if (value.length > 100) {
      setKraError('You cannot exceed Kra more than 100 characters')
      return
    }

    const exists =
      data?.kras?.some(
        (kra) =>
          normalize(kra.kra_name) === normalize(value) && kra.id !== editId
      ) ?? false

    if (exists) {
      setKraError('This KRA name already exists')
    } else {
      setKraError('')
    }
  }

  const lastItem = subKraList[subKraList.length - 1]

  const isLastItemValid =
    subKraList.length > 0 &&
    (typeof lastItem === 'string'
      ? !!lastItem.trim()
      : !!lastItem.sub_kra_name.trim())

  const hasAnyError = Boolean(
    kraError || subKraErrors.some((err) => err && err.trim() !== '')
  )

  const addField = () => {
    if (subKraList.length > 0 && !isLastItemValid) return
    setEditableSubKras((prev) => prev.map(() => false))

    setSubKraListError('')
    const nextList = ['', ...subKraList]
    setSubKraList(nextList)
    setSubKraErrors(buildSubKraErrors(nextList))
    setEditableSubKras((prev) => [true, ...prev])
    setNewSubKraFlags((prev) => [true, ...prev])
    setFocusIndex(0)
    setActiveEditIndex(0)
    setIsSecondaryEditing(true)
  }

  const getSubKraValue = (item: SubKraType) =>
    typeof item === 'string' ? item : item.sub_kra_name

  const deleteField = (index: number) => {
    if (subKraList.length <= 1) {
      const currentValue = getSubKraValue(subKraList[index])
      if (currentValue.trim() !== '') {
        setSubKraListError('At least one Secondary KRA is required')
        return
      }
    }
    const nextList = subKraList.filter((_, i) => i !== index)
    setSubKraList(nextList)
    setEditableSubKras((prev) => prev.filter((_, i) => i !== index))
    setNewSubKraFlags((prev) => prev.filter((_, i) => i !== index))
    setSubKraErrors(buildSubKraErrors(nextList))
  }

  const handleInputChange = (index: number, value: string) => {
    if (subKraListError) setSubKraListError('')
    const nextList = subKraList.map((item, i) => {
      if (i !== index) return item

      if (typeof item === 'string') {
        return value
      }
      return {
        ...item,
        sub_kra_name: value,
      }
    })

    setSubKraList(nextList)

    const nextErrors = buildSubKraErrors(nextList)
    if (value.length > 750) {
      nextErrors[index] =
        'You cannot exceed Secondary Kra more than 750 characters'
    }
    setSubKraErrors(nextErrors)
  }

  useEffect(() => {
    if (focusIndex === null) return
    const wrapper = subKraInputRefs.current[focusIndex]
    const input = wrapper?.querySelector('input') as HTMLInputElement | null
    if (input) {
      input.focus()
      input.select()
      setFocusIndex(null)
    }
  }, [focusIndex])

  const resetForm = () => {
    setFormData(undefined)
    setKraName('')
    setSubKraList([])
    setKraError('')
    setSubKraErrors([])
    setSubKraListError('')
    setEditableSubKras([])
    setNewSubKraFlags([])
    setActiveEditIndex(null)
    setIsSecondaryEditing(false)
  }
  const handleAddKra = () => {
    const subKraNames = subKraList.map((item) =>
      typeof item === 'string' ? item.trim() : item.sub_kra_name.trim()
    )
    const newData = {
      kra_name: kraName,
      sub_kras: subKraNames,
    }
    addNewKra(newData)
      .unwrap()
      .then(() => {
        resetForm()
        if (closeForm) closeForm()
        listDataRefetch()
      })
  }

  const handleUpdateKra = () => {
    if (!formData) return

    const subKra = subKraList.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return { ...item, is_deleted: false }
      }

      return {
        id: null,
        kra_id: formData.id,
        sub_kra_name: String(item),
        is_deleted: false,
      }
    })

    const updateData = {
      ...formData,
      kra_name: kraName,
      sub_kras: subKra,
    }

    updateKra(updateData as KraUpdateRequest)
      .unwrap()
      .then(() => {
        setSubKraListError('')
        if (closeForm) closeForm()
        if (refetch) refetch()
      })
  }

  const areAllSubKrasFilled = subKraList.every((field) => {
    if (typeof field === 'string') {
      return field.trim() !== ''
    }
    return field.sub_kra_name.trim() !== ''
  })

  const hasAtLeastOneSubKra = subKraList.length > 0

  const isFormValid =
    kraName.trim() !== '' && areAllSubKrasFilled && hasAtLeastOneSubKra

  const isLastSubKraValid = subKraErrors?.some(
    (err) => err && err.trim() !== ''
  )

  const handleCancelFormOpen = () => {
    setCancelForm(true)
  }

  const handleConfirm = () => {
    if (closeForm) closeForm()
    if (kraFormLabel === 'Add new KRA') {
      resetForm()
    } else {
      const formDataById = data?.kras.find((item) => item.id === editId)
      if (formDataById) {
        setFormData(formDataById)
      }
      setKraName(formDataById?.kra_name || '')
      setSubKraList(formDataById?.sub_kras || [])
      setSubKraListError('')
    }
    setIsSecondaryEditing(false)
    setCancelForm(false)
  }

  const handleCancelFormClose = () => {
    setCancelForm(false)
  }

  const handleSubKraPopupOpen = () => {
    setSubKraPopup(true)
  }

  const handleSubKraPopupClose = () => {
    setSubKraPopup(false)
  }

  const handleDeleteConfirmOpen = (item: SubKraType, index: number) => {
    setPendingDeleteSubKra(item)
    setPendingDeleteIndex(index)
    setShowDeleteSubKraConfirm(true)
  }

  const handleDeleteConfirmClose = () => {
    setShowDeleteSubKraConfirm(false)
    setPendingDeleteSubKra(null)
    setPendingDeleteIndex(null)
  }

  const handleDeleteSubKra = (
    item:
      | string
      | { id?: string; sub_kra_name: string; is_associated?: boolean },
    index: number
  ) => {
    if (typeof item !== 'string' && item.is_associated) {
      handleSubKraPopupOpen()
      return
    }
    deleteField(index)
  }

  const handleDeleteConfirm = () => {
    if (pendingDeleteSubKra !== null && pendingDeleteIndex !== null) {
      handleDeleteSubKra(pendingDeleteSubKra, pendingDeleteIndex)
    }
    handleDeleteConfirmClose()
  }

  const handleCancelSubKraConfirmOpen = (index: number) => {
    setPendingCancelIndex(index)
    setShowCancelSubKraConfirm(true)
  }

  const handleCancelSubKraConfirmClose = () => {
    setShowCancelSubKraConfirm(false)
    setPendingCancelIndex(null)
  }

  const cancelSubKraEdit = (index: number) => {
    ignoreBlurIndex.current = null
    if (newSubKraFlags[index]) {
      const nextList = subKraList.filter((_, i) => i !== index)
      setSubKraList(nextList)
      setEditableSubKras((prev) => prev.filter((_, i) => i !== index))
      setNewSubKraFlags((prev) => prev.filter((_, i) => i !== index))
      setSubKraErrors(buildSubKraErrors(nextList))
      setSubKraListError('')
      setActiveEditIndex(null)
      setIsSecondaryEditing(false)
      setSubKraOriginals((prev) => {
        const { [index]: _, ...rest } = prev
        return rest
      })
      return
    }

    const originalValue = subKraOriginals[index] ?? ''
    const nextList = subKraList.map((item, i) => {
      if (i !== index) return item
      if (typeof item === 'string') {
        return originalValue
      }
      return {
        ...item,
        sub_kra_name: originalValue,
      }
    })
    setSubKraList(nextList)
    setSubKraErrors(buildSubKraErrors(nextList))
    setEditableSubKras((prev) => prev.map(() => false))
    setActiveEditIndex(null)
    setIsSecondaryEditing(false)
    setSubKraOriginals((prev) => {
      const { [index]: _, ...rest } = prev
      return rest
    })
  }

  const handleCancelSubKraConfirm = () => {
    if (pendingCancelIndex !== null) {
      cancelSubKraEdit(pendingCancelIndex)
    }
    handleCancelSubKraConfirmClose()
  }

  const requestCancelSubKraEdit = (index: number) => {
    const currentValue = getSubKraValue(subKraList[index])
    const originalValue =
      subKraOriginals[index] ?? getSubKraValue(subKraList[index])

    if (newSubKraFlags[index]) {
      if (currentValue.trim()) {
        handleCancelSubKraConfirmOpen(index)
        return
      }
      cancelSubKraEdit(index)
      return
    }

    if (currentValue.trim() !== originalValue.trim()) {
      handleCancelSubKraConfirmOpen(index)
      return
    }

    cancelSubKraEdit(index)
  }

  const startSubKraEdit = (index: number) => {
    const currentValue = getSubKraValue(subKraList[index])
    setSubKraOriginals((prev) => ({ ...prev, [index]: currentValue }))
    setEditableSubKras((prev) => prev.map((_, i) => i === index))
    setActiveEditIndex(index)
    setIsSecondaryEditing(true)
  }

  const confirmSubKraEdit = (index: number) => {
    const nextErrors = buildSubKraErrors(subKraList, {
      includeRequired: true,
    })
    setSubKraErrors(nextErrors)
    if (nextErrors[index]) return

    ignoreBlurIndex.current = null
    setEditableSubKras((prev) => prev.map(() => false))
    setActiveEditIndex(null)
    setIsSecondaryEditing(false)
    setNewSubKraFlags((prev) =>
      prev.map((value, i) => (i === index ? false : value))
    )
    setSubKraOriginals((prev) => {
      const { [index]: _, ...rest } = prev
      return rest
    })
  }

  return (
    <>
      <div className="deletePopUp">
        <CustomModal
          show={subKraPopup}
          onClose={handleSubKraPopupClose}
          image={CloseWhiteIcon}
          type="Warning"
          modalHeading="Secondary KRA delete not possible"
          modalDesc="This Secondary KRA is already used so can not delete this Secondary KRA."
          mode="info"
        />
      </div>
      <CustomModal
        show={cancelForm}
        onClose={handleCancelFormClose}
        onConfirm={handleConfirm}
        image={CloseWhiteIcon}
        modalHeading="Cancel KRA"
        modalDesc="Are you sure you want to cancel the KRA"
        type="Warning"
      />
      <CustomModal
        show={showDeleteSubKraConfirm}
        onClose={handleDeleteConfirmClose}
        onConfirm={handleDeleteConfirm}
        image={DeleteWhiteIcon}
        modalHeading="Delete Secondary KRA"
        modalDesc="Are you sure you want to delete this Secondary KRA?"
        type="Warning"
        mode="confirm"
      />
      <CustomModal
        show={showCancelSubKraConfirm}
        onClose={handleCancelSubKraConfirmClose}
        onConfirm={handleCancelSubKraConfirm}
        image={CloseWhiteIcon}
        modalHeading="Cancel changes"
        modalDesc="Are you sure you want to cancel the changes? It will lose the data."
        type="Warning"
        mode="confirm"
      />
      <Modal
        show={show}
        onHide={closeForm}
        centered
        size="lg"
        className="KraFormModal"
        backdrop="static"
      >
        <div className="kraFormWrapper">
          <Modal.Header className="border-0">
            <Modal.Title className="modelRatingHeading">
              {kraFormLabel}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="kra-name-wrapper">
              <div className="kraTopRow">
                <div className="kraNameField">
                  <CommonInput
                    label="KRA name"
                    placeholder="Please enter kra name"
                    width="100%"
                    value={kraName}
                    onChange={handleKraName}
                    maxLength={101}
                  />
                </div>
                <button
                  className="add-btn primaryBgColor textWhite addMore subBtn kraAddButton"
                  disabled={
                    !kraName.trim() ||
                    activeEditIndex !== null ||
                    isLastSubKraValid ||
                    hasAnyError ||
                    (subKraList.length > 0 && !isLastItemValid)
                  }
                  onClick={addField}
                >
                  <img src={addIcon} alt="Add" /> Add Secondary KRA
                </button>
              </div>
              {kraError && <p className="kra-error textRed">{kraError}</p>}
            </div>

            {subKraList.length > 0 && (
              <div className="kraPointsTable">
                <div className="kraPointsTableHeader mb-1">
                  <div className="kraPointsColText">Secondary KRA</div>
                  <div className="kraPointsColAction">Action</div>
                </div>
                <div className="kraPointsTableBody">
                  {subKraList.map((value, index) => {
                    const isEditForm = kraFormLabel === 'Edit KRA'
                    const isEditable = isEditForm
                      ? (editableSubKras[index] ??
                        (typeof value === 'string'
                          ? !value.trim()
                          : !value.sub_kra_name?.trim()))
                      : (editableSubKras[index] ?? true)
                    const isAnotherEditing =
                      activeEditIndex !== null && activeEditIndex !== index

                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <div className="kraPointsRow" key={`subKra-${index}`}>
                        <div className="kraPointsColText">
                          <div
                            className={`subKraInputField ${
                              !isEditable ? 'subKraReadOnlyWrapper' : ''
                            }`}
                            ref={(el) => {
                              subKraInputRefs.current[index] = el
                            }}
                          >
                            <CommonInput
                              label=""
                              placeholder="Please enter Secondary KRA"
                              width="100%"
                              value={
                                typeof value === 'string'
                                  ? value
                                  : value.sub_kra_name
                              }
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                              className={`kraRowInput ${
                                !isEditable ? 'subKraReadOnly' : ''
                              }`}
                              readOnly={!isEditable}
                              maxLength={751}
                            />
                          </div>
                        </div>
                        <div className="kraPointsColAction">
                          <button
                            type="button"
                            className="transparentButton"
                            disabled={isAnotherEditing && !isEditable}
                            onMouseDown={() => {
                              ignoreBlurIndex.current = index
                            }}
                            onClick={() =>
                              isEditable
                                ? confirmSubKraEdit(index)
                                : startSubKraEdit(index)
                            }
                          >
                            <img
                              src={isEditable ? RightTick : EditIcon}
                              alt={isEditable ? 'Save' : 'Edit'}
                            />
                          </button>
                          {isEditable ? (
                            <button
                              type="button"
                              className="transparentButton"
                              onMouseDown={() => {
                                ignoreBlurIndex.current = index
                              }}
                              onClick={() => requestCancelSubKraEdit(index)}
                            >
                              <img src={CrossIcon} alt="Cancel" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="transparentButton"
                              disabled={isAnotherEditing}
                              onClick={() =>
                                handleDeleteConfirmOpen(value, index)
                              }
                            >
                              <img src={DeleteIcon} alt="Delete" />
                            </button>
                          )}
                        </div>
                        {subKraErrors[index] && (
                          <p className="kra-error textRed">
                            {subKraErrors[index]}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
                {subKraListError && (
                  <p className="kra-error textRed small ps-3">
                    {subKraListError}
                  </p>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-start">
            <SharedButton
              label="Cancel"
              variant="outline"
              onClick={handleCancelFormOpen}
            />
            <SharedButton
              label={kraFormLabel === 'Edit KRA' ? 'Update' : 'Save'}
              disabled={
                !isFormValid ||
                addKraLoading ||
                updateKraLoading ||
                hasAnyError ||
                isSecondaryEditing
              }
              onClick={
                kraFormLabel === 'Edit KRA' ? handleUpdateKra : handleAddKra
              }
            >
              {addKraLoading ||
                (updateKraLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ))}
            </SharedButton>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  )
}

export default KraForm
