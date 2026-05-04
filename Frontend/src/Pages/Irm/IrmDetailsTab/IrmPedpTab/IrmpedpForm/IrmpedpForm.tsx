/* eslint-disable */

import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'

import addIcon from '@project/assets/images/AddIcon.png'
import CancelIcon from '@project/assets/images/Cancel.svg'
import deleteBlack from '@project/assets/images/DeleteBlack.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import PublishedIcon from '@project/assets/images/greenRightIcon.svg'
import DeleteWhiteIcon from '@project/assets/images/DeleteWhiteIcon.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'

import './IrmpedpForm.scss'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useAddCdpFormMutation,
  useDeleteCdpMutation,
  useUpdateCdpFormMutation,
} from '@project/Store/Api/Manager'

type Props = {
  employee_user_id: string
  pedp_form_id: string
  refetchDetails?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingCdp?: any[]
}

type RowType = {
  strength: string
  development_need: string
  training_need: string
  no_of_hours: string
  employee_cdp_id?: string
}

type ErrorType = Partial<RowType>

const EMPTY_ROW: RowType = {
  strength: '',
  development_need: '',
  training_need: '',
  no_of_hours: '',
}

const FIELDS = [
  { key: 'strength', placeholder: 'Please enter strength' },
  { key: 'development_need', placeholder: 'Please enter goal name' },
  { key: 'training_need', placeholder: 'Please enter goal name' },
  { key: 'no_of_hours', placeholder: 'Enter hours' },
] as const

export default function IrmpedpForm({
  employee_user_id,
  pedp_form_id,
  refetchDetails,
  existingCdp,
}: Props) {
  const [formData, setFormData] = useState<RowType[]>([EMPTY_ROW])
  const [errors, setErrors] = useState<ErrorType[]>([{}])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  // API mutation
  const [addCdpForm] = useAddCdpFormMutation()
  const [updateCdpForm] = useUpdateCdpFormMutation()
  const [deleteCdpForm] = useDeleteCdpMutation()

  /* ---------- validation ---------- */
  const validateRow = (row: RowType): ErrorType => {
    const err: ErrorType = {}

    if (!row.strength) err.strength = 'strength is required'
    if (!row.development_need)
      err.development_need = 'Development need is required'
    if (!row.training_need) err.training_need = 'Training need is required'
    if (!row.no_of_hours) err.no_of_hours = 'Hours are required'
    else if (!/^[1-9]\d*$/.test(row.no_of_hours))
      err.no_of_hours = 'Enter a valid positive number'

    return err
  }

  const isRowValid = (index: number) =>
    Object.keys(errors[index] || {}).length === 0 &&
    Object.values(formData[index]).every(Boolean)

  /* ---------- handlers ---------- */
  const handleChange = (index: number, key: keyof RowType, value: string) => {
    const updatedRows = [...formData]
    updatedRows[index] = { ...updatedRows[index], [key]: value }

    const updatedErrors = [...errors]
    updatedErrors[index] = validateRow(updatedRows[index])

    setFormData(updatedRows)
    setErrors(updatedErrors)
  }

  const handleAddUpdateRow = async (index: number) => {
    if (!isRowValid(index)) return

    const row = formData[index]
    const isNewRow = !row.employee_cdp_id

    const payload = {
      employee_user_id,
      pedp_form_id,
      strength: row.strength,
      development_need: row.development_need,
      training_need: row.training_need,
      no_of_hours: row.no_of_hours,
    }

    try {
      let response: { message?: string; employee_cdp_id?: string }

      if (!isNewRow) {
        // UPDATE
        response = (await updateCdpForm({
          employee_cdp_id: row.employee_cdp_id!,
          ...payload,
        }).unwrap()) as { message?: string; employee_cdp_id?: string }
      } else {
        // ADD
        response = (await addCdpForm(payload).unwrap()) as {
          message?: string
          employee_cdp_id?: string
        }
        row.employee_cdp_id = response.employee_cdp_id!
      }
      if (response?.message) {
        showSuccessToast(response.message) // or showSuccessToast
      }

      setFormData((prev) => {
        const updated = [...prev]
        updated[index] = row

        if (isNewRow && index === prev.length - 1) {
          updated.push(EMPTY_ROW)
        }

        return updated
      })

      setErrors((prev) => {
        const updated = [...prev]
        updated[index] = {}

        if (isNewRow && index === prev.length - 1) {
          updated.push({})
        }

        return updated
      })

      setEditIndex(null)

      if (isNewRow) {
        refetchDetails?.()
      }
    } catch (error) {
      showErrorToast('Something went wrong')
    }
  }

  const removeRow = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
    setErrors(errors.filter((_, i) => i !== index))
  }

  const handleDeleteRow = async (index: number) => {
    const row = formData[index]

    // If row is not saved yet → just remove locally
    if (!row.employee_cdp_id) {
      removeRow(index)
      showErrorToast('Row removed') // or success toast
      return
    }

    try {
      const response = (await deleteCdpForm({
        employee_user_id,
        pedp_form_id,
        employee_cdp_id: row.employee_cdp_id,
      }).unwrap()) as { message?: string }

      if (response?.message) {
        showSuccessToast(response.message)
      }
      removeRow(index)
      refetchDetails?.()
    } catch (error) {
      showErrorToast('Failed to delete CDP row')
    }
  }

  useEffect(() => {
    if (existingCdp && existingCdp.length > 0) {
      const mappedRows: RowType[] = existingCdp
        .filter(
          (item) =>
            item.strength ||
            item.development_need ||
            item.training_need ||
            item.no_of_hours
        )
        .map((item) => ({
          employee_cdp_id: item.employee_cdp_id,
          strength: item.strength ?? '',
          development_need: item.development_need ?? '',
          training_need: item.training_need ?? '',
          no_of_hours: item.no_of_hours ?? '',
        }))

      setFormData([...mappedRows, EMPTY_ROW])
      setErrors([...mappedRows.map(() => ({})), {}])
    }
  }, [existingCdp])

  /* ---------- UI ---------- */
  return (
    <div className="cdpTableWrapper">
      <Table responsive className="mb-0">
        <thead className="tableHeader">
          <tr>
            <th style={{ width: '2%' }}>#</th>
            <th>strengths</th>
            <th>Development needs</th>
            <th>Training needs (Technical competency / Soft skills)</th>
            <th>No. of hours</th>
            <th style={{ width: '12%' }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {formData.map((row, index) => {
            const isLastRow = index === formData.length - 1

            // const isEditing = editIndex === index || isLastRow
            const isEditing =
              editIndex === index || (isLastRow && !row.employee_cdp_id)

            return (
              <tr key={row.employee_cdp_id ?? `new-${index}`}>
                <td>{String(index + 1).padStart(2, '0')}</td>

                {FIELDS.map(({ key, placeholder }) => (
                  <td key={key}>
                    {isEditing ? (
                      <>
                        <CommonInput
                          value={row[key]}
                          placeholder={placeholder}
                          width="100%"
                          onChange={(e) =>
                            handleChange(index, key, e.target.value)
                          }
                        />
                        {errors[index]?.[key] && (
                          <small className="text-danger">
                            {errors[index][key]}
                          </small>
                        )}
                      </>
                    ) : (
                      <span>{row[key]}</span>
                    )}
                  </td>
                ))}

                <td>
                  {/* eslint-disable-next-line no-nested-ternary */}

                  {isLastRow ? (
                    <SharedButton
                      label="Add more"
                      icon={addIcon}
                      disabled={!isRowValid(index)}
                      onClick={() => handleAddUpdateRow(index)}
                    />
                  ) : isEditing ? (
                    <div>
                      <Button
                        variant="none"
                        size="sm"
                        onClick={() => handleAddUpdateRow(index)}
                      >
                        <img src={PublishedIcon} alt="save" />
                      </Button>
                      <Button
                        variant="none"
                        size="sm"
                        onClick={() => setEditIndex(null)}
                      >
                        <img src={CancelIcon} alt="cancel" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="none"
                        size="sm"
                        className="me-2"
                        onClick={() => setEditIndex(index)}
                      >
                        <img src={EditIcon} alt="edit" />
                      </Button>
                      <Button
                        variant="none"
                        size="sm"
                        onClick={() => {
                          setDeleteIndex(index)
                          setShowModal(true)
                        }}
                      >
                        <img src={deleteBlack} alt="delete" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <CustomModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setDeleteIndex(null)
        }}
        onConfirm={() => {
          if (deleteIndex !== null) {
            handleDeleteRow(deleteIndex)
          }
          setShowModal(false)
          setDeleteIndex(null)
        }}
        image={DeleteWhiteIcon}
        modalHeading="Confirm Delete"
        modalDesc="Are you sure you want to delete this CDP row?"
        type="Warning"
        mode="confirm"
      />
    </div>
  )
}
