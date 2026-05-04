import { useEffect, useRef, useState } from 'react'

import { Modal } from 'react-bootstrap'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import * as Yup from 'yup'

import AddIcon from '@project/assets/images/AddIcon.png'
import CloseWhiteIcon from '@project/assets/images/CloseWhiteIcon.svg'
import CrossIcon from '@project/assets/images/CrossTick.svg'
import Delete from '@project/assets/images/DeleteBlack.svg'
import EditIcon from '@project/assets/images/Edit.svg'
import RightTick from '@project/assets/images/RightTick.svg'
import SharedButton from '@project/Components/Button/SharedButton'
import CustomModal from '@project/Components/Modal/Modal'
import {
  useAddRatingPointsMutation,
  useGetRatingByIdQuery,
  useUpdateRatingPointsMutation,
} from '@project/Store/Api/Admin/Ratings'
import {
  RatingPoints,
  RatingPointsFormValues,
  RatingPointsRequest,
} from '@project/Types/rating'
import { showSuccessToast } from '@project/Utils/notificationPopup'

import './AddRatingPoints.scss'

interface Props {
  show: boolean
  onClose: () => void
  ratingId: string | null
  onSuccess?: () => void
}

function AddRatingPoints({ show, onClose, ratingId, onSuccess }: Props) {
  const [addRatingPoints] = useAddRatingPointsMutation()
  const [updateRatingPoints] = useUpdateRatingPointsMutation()
  const [existingPoints, setExistingPoints] = useState<RatingPoints[]>([])
  const [existingPointErrors, setExistingPointErrors] = useState<
    Record<string, string>
  >({})
  const [newPointOriginals, setNewPointOriginals] = useState<
    Record<number, string>
  >({})
  const [existingPointOriginals, setExistingPointOriginals] = useState<
    Record<string, string>
  >({})
  const [newPointText, setNewPointText] = useState('')
  const [editableNewIndex, setEditableNewIndex] = useState<number | null>(null)
  const [editableExistingId, setEditableExistingId] = useState<string | null>(
    null
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteExistingId, setDeleteExistingId] = useState<string | null>(null)
  const removeRef = useRef<((index: number) => void) | null>(null)

  const normalizePoint = (value?: string | null) =>
    (value || '').toLowerCase().replace(/\s+/g, '')

  const focusInputById = (inputId: string) => {
    setTimeout(() => {
      const input = document.getElementById(inputId) as HTMLInputElement | null
      if (!input) return
      input.focus()
      const valueLength = input.value?.length || 0
      input.setSelectionRange(valueLength, valueLength)
    }, 0)
  }

  const { data: ratingData } = useGetRatingByIdQuery(ratingId!, {
    skip: !ratingId,
    refetchOnMountOrArgChange: true,
  })

  // Detect edit mode
  const isEditMode =
    !!ratingId &&
    Array.isArray(ratingData?.rating_points) &&
    ratingData.rating_points.length > 0

  // Initial Formik values
  const initialValues: RatingPointsFormValues = {
    id: ratingId,
    rating_points: [],
  }

  const validationSchema = Yup.object().shape({
    rating_points: Yup.array().test(
      'at-least-one',
      'This field is required',
      (value) => {
        if (isEditMode) return true
        return Array.isArray(value)
          ? value.some((item) => !!item?.rating_points?.trim())
          : false
      }
    ),
  })

  // Submit handler
  const handleSubmit = async (values: RatingPointsFormValues) => {
    // Safety check: ensure rating_points is an array with valid items
    if (!Array.isArray(values.rating_points)) {
      return
    }

    const newPoints: RatingPoints[] = values.rating_points
      .filter((item) => {
        return (
          item &&
          typeof item === 'object' &&
          'rating_points' in item &&
          (item.rating_points as string | undefined)?.trim() !== ''
        )
      })
      .map((item) => ({
        id: item.id ?? null,
        rating_points: (item.rating_points as string).trim(),
      }))

    const finalRatingPoints: RatingPoints[] = [
      ...existingPoints.map((item) => ({
        id: item.id,
        rating_points: item.rating_points,
      })),
      ...newPoints.map((item) => ({
        id: null,
        rating_points: item.rating_points,
      })),
    ]

    const payload: RatingPointsRequest = {
      id: values.id!,
      rating_points: finalRatingPoints,
    }

    if (isEditMode) {
      const response = await updateRatingPoints(payload).unwrap()
      showSuccessToast(response?.message)
    } else {
      const response = await addRatingPoints(payload).unwrap()
      showSuccessToast(response?.message)
    }

    onSuccess?.()
    onClose()
  }

  // Delete handler for existing points
  const deleteExistingPoint = (id: string) => {
    setExistingPoints((prev) => prev.filter((item) => item.id !== id))
  }

  const handleExistingPointChange = (id: string, value: string) => {
    setExistingPoints((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rating_points: value } : item
      )
    )
    if (value.trim()) {
      setExistingPointErrors((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false)
    setDeleteIndex(null)
    setDeleteExistingId(null)
  }

  const handleCancelConfirmClose = () => {
    setShowCancelConfirm(false)
  }

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false)
    onClose()
  }

  const handleDeleteConfirm = () => {
    if (typeof deleteIndex === 'number' && removeRef.current) {
      removeRef.current(deleteIndex)
    }
    if (deleteExistingId) {
      deleteExistingPoint(deleteExistingId)
    }
    handleDeleteConfirmClose()
  }

  // Pre-fill existing points on edit
  useEffect(() => {
    if (ratingData?.rating_points) {
      setExistingPoints(ratingData.rating_points)
    }
  }, [ratingData])

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        size="lg"
        className="AddRatingForm"
        backdrop="static"
        keyboard={false}
      >
        <div className="addRatingFormWrapper">
          <Modal.Header className="border-0">
            <Modal.Title className="modelRatingHeading">
              Add rating points
            </Modal.Title>
          </Modal.Header>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ values, setFieldValue, setFieldError, setFieldTouched }) => {
              const isAnyRowEditing =
                editableNewIndex !== null || editableExistingId !== null
              const hasExistingPointValidationError = Object.values(
                existingPointErrors
              ).some((message) => !!message?.trim())
              const hasInvalidNewRows = (values.rating_points || []).some(
                (row) =>
                  row &&
                  typeof row === 'object' &&
                  'rating_points' in row &&
                  !(row.rating_points || '').trim()
              )
              const hasInvalidExistingRows = existingPoints.some(
                (row) => !(row?.rating_points || '').trim()
              )
              const hasAtLeastOneValidRatingPoint = [
                ...existingPoints,
                ...(values.rating_points || []),
              ].some(
                (row) =>
                  row &&
                  typeof row === 'object' &&
                  'rating_points' in row &&
                  !!(row.rating_points || '').trim()
              )
              const normalizedAllPoints = [
                ...existingPoints.map((row) =>
                  normalizePoint(row.rating_points)
                ),
                ...(values.rating_points || []).map((row) =>
                  normalizePoint(row?.rating_points)
                ),
              ].filter(Boolean)
              const hasDuplicateRatingPoints =
                new Set(normalizedAllPoints).size !== normalizedAllPoints.length

              const initialExistingPoints = (
                ratingData?.rating_points || []
              ).map((row: RatingPoints) => ({
                id: row?.id || null,
                rating_points: (row?.rating_points || '').trim(),
              }))

              const currentExistingPoints = (existingPoints || []).map(
                (row) => ({
                  id: row?.id || null,
                  rating_points: (row?.rating_points || '').trim(),
                })
              )

              const hasExistingPointsChanged =
                initialExistingPoints.length !== currentExistingPoints.length ||
                initialExistingPoints.some(
                  (row: RatingPoints, index: number) => {
                    const current = currentExistingPoints[index]
                    return (
                      row.id !== current?.id ||
                      normalizePoint(row.rating_points) !==
                      normalizePoint(current?.rating_points)
                    )
                  }
                )

              const hasNewRows = (values.rating_points || []).length > 0
              const hasAnyChange = hasExistingPointsChanged || hasNewRows

              const isSaveDisabled =
                isAnyRowEditing ||
                hasExistingPointValidationError ||
                hasInvalidNewRows ||
                hasInvalidExistingRows ||
                (hasAtLeastOneValidRatingPoint && hasDuplicateRatingPoints) ||
                !hasAnyChange

              const showTableHeaders =
                existingPoints.length > 0 ||
                (values.rating_points && values.rating_points.length > 0)

              return (
                <Form>
                  <Modal.Body>
                    {/* New points FieldArray */}
                    <FieldArray name="rating_points">
                      {({ insert, remove }) => {
                        removeRef.current = remove

                        return (
                          <>
                            <div className="ratingPointsInputRow">
                              <div className="ratingPointsInputField">
                                <label
                                  className="ratingPointsLabel"
                                  htmlFor="ratingPointsInput"
                                >
                                  Rating points
                                </label>
                                <textarea
                                  id="ratingPointsInput"
                                  className="form-control ratingPointsTextarea"
                                  placeholder="Please enter description"
                                  maxLength={500}
                                  value={newPointText}
                                  onChange={(e) => {
                                    const { value } = e.target
                                    setNewPointText(value)
                                    setFieldTouched(
                                      'rating_points',
                                      true,
                                      false
                                    )
                                    const trimmedValue = value.trim()
                                    if (!trimmedValue) {
                                      setFieldError('rating_points', '')
                                      return
                                    }

                                    const normalizedTrimmedValue =
                                      normalizePoint(trimmedValue)
                                    const hasDuplicate = [
                                      ...existingPoints,
                                      ...(values.rating_points || []),
                                    ].some(
                                      (row) =>
                                        normalizePoint(row?.rating_points) ===
                                        normalizedTrimmedValue
                                    )

                                    if (hasDuplicate) {
                                      setFieldError(
                                        'rating_points',
                                        'Rating point already exists'
                                      )
                                      return
                                    }

                                    setFieldError('rating_points', '')
                                  }}
                                />
                                <ErrorMessage name="rating_points">
                                  {(message) =>
                                    typeof message === 'string' &&
                                      !isAnyRowEditing ? (
                                      <div className="text-danger errorMessagePadding">
                                        {message}
                                      </div>
                                    ) : null
                                  }
                                </ErrorMessage>
                              </div>
                              <button
                                className="add-btn primaryBgColor textWhite addMore subBtn ratingPointsAddButton"
                                type="button"
                                onClick={() => {
                                  if (isAnyRowEditing) {
                                    setFieldError(
                                      'rating_points',
                                      'Please save or cancel the current edit before adding a new rating point'
                                    )
                                    return
                                  }
                                  const trimmedValue = newPointText.trim()
                                  if (!trimmedValue) {
                                    setFieldError(
                                      'rating_points',
                                      'This field is required'
                                    )
                                    return
                                  }
                                  const normalizedTrimmedValue =
                                    normalizePoint(trimmedValue)
                                  const hasDuplicate = [
                                    ...existingPoints,
                                    ...(values.rating_points || []),
                                  ].some(
                                    (row) =>
                                      normalizePoint(row?.rating_points) ===
                                      normalizedTrimmedValue
                                  )
                                  if (hasDuplicate) {
                                    return
                                  }
                                  insert(0, {
                                    id: null,
                                    rating_points: trimmedValue,
                                  })
                                  setNewPointText('')
                                  setEditableNewIndex(null)
                                  setEditableExistingId(null)
                                }}
                                disabled={
                                  isAnyRowEditing || !newPointText.trim()
                                }
                              >
                                <img src={AddIcon} alt="Add" /> Add
                              </button>
                            </div>
                            {showTableHeaders && (
                              <div className="ratingPointsTable">
                                <div className="ratingPointsTableHeader mb-1">
                                  <div className="ratingPointsHeaderText">
                                    Rating points
                                  </div>
                                  <div className="ratingPointsHeaderAction">
                                    Action
                                  </div>
                                </div>

                                <div className="ratingPointsTableBody">
                                  {values.rating_points?.map(
                                    (item: RatingPoints, index: number) => {
                                      if (
                                        !item ||
                                        typeof item !== 'object' ||
                                        !('rating_points' in item)
                                      ) {
                                        return null
                                      }
                                      const isNewEditable =
                                        editableNewIndex === index
                                      const isActionLocked =
                                        isAnyRowEditing && !isNewEditable

                                      return (
                                        <div
                                          key={item.id ?? index}
                                          className="ratingPointsRow"
                                        >
                                          <div className="ratingPointsColText">
                                            {isNewEditable ? (
                                              <Field
                                                id={`new-rating-point-${index}`}
                                                name={`rating_points[${index}].rating_points`}
                                                className="form-control ratingPointsRowInput"
                                                maxLength={500}
                                                onChange={(
                                                  e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                  const { value } = e.target
                                                  if (value.length > 500) {
                                                    setFieldError(
                                                      `rating_points[${index}].rating_points`,
                                                      'Maximum 500 characters allowed'
                                                    )
                                                    return
                                                  }
                                                  setFieldError(
                                                    `rating_points[${index}].rating_points`,
                                                    ''
                                                  )
                                                  setFieldValue(
                                                    `rating_points[${index}].rating_points`,
                                                    value
                                                  )
                                                }}
                                              />
                                            ) : (
                                              <div className="ratingPointsRowText">
                                                {item.rating_points}
                                              </div>
                                            )}
                                            <ErrorMessage
                                              name={`rating_points[${index}].rating_points`}
                                            >
                                              {(message) =>
                                                typeof message === 'string' ? (
                                                  <div className="text-danger errorMessagePadding">
                                                    {message}
                                                  </div>
                                                ) : null
                                              }
                                            </ErrorMessage>
                                          </div>
                                          <div className="ratingPointsColAction">
                                            <button
                                              className="transparentButton"
                                              type="button"
                                              disabled={isActionLocked}
                                              onClick={() => {
                                                if (isNewEditable) {
                                                  const fieldName = `rating_points[${index}].rating_points`
                                                  const trimmedValue =
                                                    item.rating_points?.trim()
                                                  if (!trimmedValue) {
                                                    setFieldTouched(
                                                      fieldName,
                                                      true,
                                                      false
                                                    )
                                                    setFieldError(
                                                      fieldName,
                                                      'Rating point can not be blank'
                                                    )
                                                    return
                                                  }
                                                  const normalizedTrimmedValue =
                                                    normalizePoint(trimmedValue)
                                                  const hasDuplicate = [
                                                    ...existingPoints,
                                                    ...(
                                                      values.rating_points || []
                                                    )
                                                      .filter(
                                                        (_, rowIndex) =>
                                                          rowIndex !== index
                                                      )
                                                      .map((row) => ({
                                                        rating_points:
                                                          row?.rating_points,
                                                      })),
                                                  ].some(
                                                    (row) =>
                                                      normalizePoint(
                                                        row?.rating_points
                                                      ) ===
                                                      normalizedTrimmedValue
                                                  )
                                                  if (hasDuplicate) {
                                                    setFieldTouched(
                                                      fieldName,
                                                      true,
                                                      false
                                                    )
                                                    setFieldError(
                                                      fieldName,
                                                      'Rating point already exists'
                                                    )
                                                    return
                                                  }
                                                  setFieldValue(
                                                    `rating_points[${index}].rating_points`,
                                                    trimmedValue
                                                  )
                                                  setFieldError(
                                                    `rating_points[${index}].rating_points`,
                                                    ''
                                                  )
                                                  setNewPointOriginals(
                                                    (prev) => {
                                                      const {
                                                        [index]: _,
                                                        ...rest
                                                      } = prev
                                                      return rest
                                                    }
                                                  )
                                                  setEditableNewIndex(null)
                                                  setEditableExistingId(null)
                                                  return
                                                }

                                                setNewPointOriginals(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]:
                                                      item.rating_points || '',
                                                  })
                                                )
                                                setEditableNewIndex(index)
                                                setEditableExistingId(null)
                                                focusInputById(
                                                  `new-rating-point-${index}`
                                                )
                                              }}
                                            >
                                              <img
                                                src={
                                                  isNewEditable
                                                    ? RightTick
                                                    : EditIcon
                                                }
                                                alt={
                                                  isNewEditable
                                                    ? 'Tick'
                                                    : 'Edit'
                                                }
                                              />
                                            </button>
                                            {isNewEditable ? (
                                              <button
                                                className="transparentButton ratingPointsCancelButton"
                                                type="button"
                                                onClick={() => {
                                                  const originalValue =
                                                    newPointOriginals[index]
                                                  if (
                                                    typeof originalValue ===
                                                    'string'
                                                  ) {
                                                    setFieldValue(
                                                      `rating_points[${index}].rating_points`,
                                                      originalValue
                                                    )
                                                  }
                                                  setFieldError(
                                                    `rating_points[${index}].rating_points`,
                                                    ''
                                                  )
                                                  setNewPointOriginals(
                                                    (prev) => {
                                                      const {
                                                        [index]: _,
                                                        ...rest
                                                      } = prev
                                                      return rest
                                                    }
                                                  )
                                                  setEditableNewIndex(null)
                                                }}
                                              >
                                                <img
                                                  src={CrossIcon}
                                                  alt="Cancel"
                                                />
                                              </button>
                                            ) : (
                                              <button
                                                className="transparentButton"
                                                type="button"
                                                disabled={isActionLocked}
                                                onClick={() => {
                                                  setDeleteExistingId(null)
                                                  setDeleteIndex(index)
                                                  setShowDeleteConfirm(true)
                                                }}
                                              >
                                                <img
                                                  src={Delete}
                                                  alt="Delete"
                                                />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    }
                                  )}

                                  {existingPoints
                                    ?.filter(
                                      (item) => item && typeof item === 'object'
                                    )
                                    .map((item) => {
                                      const isExistingEditable =
                                        editableExistingId === item.id
                                      const isActionLocked =
                                        isAnyRowEditing && !isExistingEditable

                                      return (
                                        <div
                                          key={item.id}
                                          className="ratingPointsRow"
                                        >
                                          <div className="ratingPointsColText">
                                            {isExistingEditable ? (
                                              <input
                                                id={`existing-rating-point-${item.id}`}
                                                className="form-control ratingPointsRowInput"
                                                value={item.rating_points || ''}
                                                onChange={(e) =>
                                                  handleExistingPointChange(
                                                    item.id!,
                                                    e.target.value
                                                  )
                                                }
                                                maxLength={500}
                                              />
                                            ) : (
                                              <div className="ratingPointsRowText">
                                                {item.rating_points}
                                              </div>
                                            )}
                                            {item.id &&
                                              existingPointErrors[item.id] && (
                                                <div className="text-danger errorMessagePadding">
                                                  {existingPointErrors[item.id]}
                                                </div>
                                              )}
                                          </div>
                                          <div className="ratingPointsColAction">
                                            <button
                                              className="transparentButton"
                                              type="button"
                                              disabled={isActionLocked}
                                              onClick={() => {
                                                if (isExistingEditable) {
                                                  const trimmedValue =
                                                    item.rating_points?.trim()
                                                  if (!trimmedValue) {
                                                    if (item.id) {
                                                      setExistingPointErrors(
                                                        (prev) => ({
                                                          ...prev,
                                                          [item.id!]:
                                                            'Rating point can not be blank',
                                                        })
                                                      )
                                                    }
                                                    return
                                                  }
                                                  const normalizedTrimmedValue =
                                                    normalizePoint(trimmedValue)
                                                  const existingWithoutCurrent =
                                                    existingPoints.filter(
                                                      (point) =>
                                                        point.id !== item.id
                                                    )
                                                  const newRowValues =
                                                    values.rating_points || []
                                                  const hasDuplicate = [
                                                    ...existingWithoutCurrent,
                                                    ...newRowValues,
                                                  ].some(
                                                    (row) =>
                                                      normalizePoint(
                                                        row?.rating_points
                                                      ) ===
                                                      normalizedTrimmedValue
                                                  )
                                                  if (hasDuplicate) {
                                                    if (item.id) {
                                                      setExistingPointErrors(
                                                        (prev) => ({
                                                          ...prev,
                                                          [item.id!]: '',
                                                        })
                                                      )
                                                    }
                                                    return
                                                  }

                                                  if (item.id) {
                                                    setExistingPointErrors(
                                                      (prev) => ({
                                                        ...prev,
                                                        [item.id!]: '',
                                                      })
                                                    )
                                                  }
                                                  if (item.id) {
                                                    setExistingPointOriginals(
                                                      (prev) => {
                                                        const {
                                                          [item.id!]: _,
                                                          ...rest
                                                        } = prev
                                                        return rest
                                                      }
                                                    )
                                                  }
                                                  if (item.id) {
                                                    setExistingPoints((prev) =>
                                                      prev.map((point) =>
                                                        point.id === item.id
                                                          ? {
                                                            ...point,
                                                            rating_points:
                                                              trimmedValue,
                                                          }
                                                          : point
                                                      )
                                                    )
                                                  }
                                                  setEditableExistingId(null)
                                                  setEditableNewIndex(null)
                                                  return
                                                }

                                                if (item.id) {
                                                  setExistingPointOriginals(
                                                    (prev) => ({
                                                      ...prev,
                                                      [item.id!]:
                                                        item.rating_points ||
                                                        '',
                                                    })
                                                  )
                                                }
                                                setEditableExistingId(
                                                  item.id || null
                                                )
                                                setEditableNewIndex(null)
                                                if (item.id) {
                                                  focusInputById(
                                                    `existing-rating-point-${item.id}`
                                                  )
                                                }
                                              }}
                                            >
                                              <img
                                                src={
                                                  isExistingEditable
                                                    ? RightTick
                                                    : EditIcon
                                                }
                                                alt={
                                                  isExistingEditable
                                                    ? 'Tick'
                                                    : 'Edit'
                                                }
                                              />
                                            </button>

                                            {isExistingEditable ? (
                                              <button
                                                className="transparentButton ratingPointsCancelButton"
                                                type="button"
                                                onClick={() => {
                                                  if (item.id) {
                                                    const originalValue =
                                                      existingPointOriginals[
                                                      item.id
                                                      ]
                                                    if (
                                                      typeof originalValue ===
                                                      'string'
                                                    ) {
                                                      setExistingPoints(
                                                        (prev) =>
                                                          prev.map((point) =>
                                                            point.id === item.id
                                                              ? {
                                                                ...point,
                                                                rating_points:
                                                                  originalValue,
                                                              }
                                                              : point
                                                          )
                                                      )
                                                    }
                                                    setExistingPointErrors(
                                                      (prev) => ({
                                                        ...prev,
                                                        [item.id!]: '',
                                                      })
                                                    )
                                                    setExistingPointOriginals(
                                                      (prev) => {
                                                        const {
                                                          [item.id!]: _,
                                                          ...rest
                                                        } = prev
                                                        return rest
                                                      }
                                                    )
                                                  }
                                                  setEditableExistingId(null)
                                                }}
                                              >
                                                <img
                                                  src={CrossIcon}
                                                  alt="Cancel"
                                                />
                                              </button>
                                            ) : (
                                              <button
                                                className="transparentButton"
                                                type="button"
                                                disabled={isActionLocked}
                                                onClick={() => {
                                                  setDeleteExistingId(
                                                    item.id || null
                                                  )
                                                  setDeleteIndex(null)
                                                  setShowDeleteConfirm(true)
                                                }}
                                              >
                                                <img
                                                  src={Delete}
                                                  alt="Delete"
                                                />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            )}
                          </>
                        )
                      }}
                    </FieldArray>
                  </Modal.Body>

                  <Modal.Footer>
                    <SharedButton
                      label="Cancel"
                      variant="outline"
                      onClick={() => setShowCancelConfirm(true)}
                    />
                    <SharedButton
                      label="Save"
                      type="submit"
                      disabled={isSaveDisabled}
                    />
                  </Modal.Footer>
                </Form>
              )
            }}
          </Formik>
        </div>
      </Modal>
      <CustomModal
        show={showDeleteConfirm}
        onClose={handleDeleteConfirmClose}
        onConfirm={handleDeleteConfirm}
        image={CloseWhiteIcon}
        modalHeading="Delete Rating Point"
        modalDesc="Are you sure you want to delete this rating point?"
        type="Warning"
        mode="confirm"
      />

      <CustomModal
        show={showCancelConfirm}
        onClose={handleCancelConfirmClose}
        onConfirm={handleCancelConfirm}
        image={CloseWhiteIcon}
        modalHeading="Cancel Rating Point"
        modalDesc="Are you sure you want to cancel the rating point?"
        type="Warning"
        mode="confirm"
      />
    </>
  )
}

export default AddRatingPoints
