import { useEffect, useState } from 'react'

import { Form } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import CancelIcon from '@project/assets/images/Cancel.svg'
import SaveIcon from '@project/assets/images/Save.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import {
  useAddNewRatingMutation,
  useCheckDuplicateRatingMutation,
  useUpdateRatingListItemMutation,
} from '@project/Store/Api/Admin/Ratings/rating'
import { AddRatingRequestNew, Ratings } from '@project/Types/rating'
import { normalize } from '@project/Utils'
import useDebounce from '@project/Utils/debounce'
import {
  showErrorToast,
  showSuccessToast,
} from '@project/Utils/notificationPopup'

import './AddRating.scss'

interface AddRatingRowProps {
  onCancel: () => void
  onSuccess: () => void
  iseditMode: boolean
  editData?: Ratings | null
  ratingFor?: string
  layout?: 'table' | 'form'
  onRegisterSave?: (fn: () => void) => void
  onDirtyChange?: (isDirty: boolean) => void
  existingRatings?: Ratings[]
}

// Initial state matching backend payload
const initialState: AddRatingRequestNew = {
  ratings: {
    id: null,
    rating_score: '',
    rating_title: '',
    rating_description: '',
    rating: '',
    is_remarks_mandatory: false,
    rating_for: '',
  },
}

type RatingErrors = {
  rating_title?: string
  rating_description?: string
  rating?: string
  rating_score?: string
  rating_for?: string
}

const limits = {
  rating_score: 2,
  rating: 10,
  rating_title: 150,
  rating_description: 500,
}

function AddRatingRow({
  onCancel,
  onSuccess,
  iseditMode,
  editData,
  ratingFor,
  layout = 'table',
  onRegisterSave,
  onDirtyChange,
  existingRatings = [],
}: AddRatingRowProps) {
  const [formData, setFormData] = useState<AddRatingRequestNew>({
    ...initialState,
    ratings: {
      ...initialState.ratings,
      rating_for: ratingFor || '',
    },
  })
  const [errors, setErrors] = useState<RatingErrors>({
    rating_title: '',
    rating_description: '',
    rating: '',
    rating_score: '',
    rating_for: '',
  })

  const [ratingTitle, setRatingTitle] = useState('')

  const debouncedRatingTitle = useDebounce(ratingTitle, 800)

  const [addNewRatingApi] = useAddNewRatingMutation()
  const [updateNewRatingApi] = useUpdateRatingListItemMutation()
  const [checkDuplicateRatingApi] = useCheckDuplicateRatingMutation()

  useEffect(() => {
    if (!debouncedRatingTitle?.trim()) return

    // Skip API call in edit mode if title unchanged
    if (
      editData &&
      debouncedRatingTitle.trim().toLowerCase() ===
      editData.rating_title?.trim().toLowerCase()
    ) {
      setErrors((prev) => ({
        ...prev,
        rating_title: '',
      }))
      return
    }

    const checkRatingTitle = async () => {
      try {
        const res = await checkDuplicateRatingApi({
          rating_title: debouncedRatingTitle,
          id: editData?.id || null,
          rating_for: formData.ratings.rating_for,
        }).unwrap()

        if (res?.message === 'Duplicate rating title found.') {
          setErrors((prev) => ({
            ...prev,
            rating_title: 'This rating title already exists',
          }))
        } else {
          setErrors((prev) => ({
            ...prev,
            rating_title: '',
          }))
        }
      } catch (err) {
        console.error('Rating title check failed', err)
      }
    }

    checkRatingTitle()
  }, [debouncedRatingTitle, checkDuplicateRatingApi])

  const isDuplicateValue = (
    field: 'rating_title' | 'rating' | 'rating_score' | 'rating_description',
    value: string
  ) => {
    if (!value) return false
    return existingRatings.some((item) => {
      if (editData?.id && item.id === editData.id) return false
      if (field === 'rating_title') {
        return normalize(item.rating_title) === normalize(value)
      }
      if (field === 'rating') {
        return normalize(item.rating) === normalize(value)
      }
      if (field === 'rating_score') {
        return normalize(String(item.rating_score ?? '')) === normalize(value)
      }
      if (field === 'rating_description') {
        return normalize(item.rating_description) === normalize(value)
      }
      return false
    })
  }

  // -----------------------------
  // Input Change Handlers
  // -----------------------------
  const updateField = (field: keyof Ratings, value: string) => {
    if (field === 'rating_title' && value.length > limits.rating_title) {
      setErrors((prev) => ({
        ...prev,
        rating_title: `Maximum ${limits.rating_title} characters allowed`,
      }))
      return
    }

    if (
      field === 'rating_description' &&
      value.length > limits.rating_description
    ) {
      setErrors((prev) => ({
        ...prev,
        rating_description: `Maximum ${limits.rating_description} characters allowed`,
      }))
      return
    }

    setFormData((prev) => ({
      ratings: {
        ...prev.ratings,
        [field]: value,
      },
    }))

    if (field === 'rating_title') {
      setRatingTitle(value)
    }

    if (field === 'rating_description') {
      const isDescriptionDuplicate = isDuplicateValue(
        'rating_description',
        value
      )
      setErrors((prev) => ({
        ...prev,
        rating_description: isDescriptionDuplicate
          ? 'Description already exists'
          : '',
      }))
    }
  }

  const updateScore = (value: string) => {
    setFormData((prev) => ({
      ratings: {
        ...prev.ratings,
        rating_score: value,
      },
    }))
  }

  const handleScoreChange = (value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        rating_score: 'Only numeric values are allowed',
      }))
      return
    }

    if (value.length > limits.rating_score) {
      setErrors((prev) => ({
        ...prev,
        rating_score: `Maximum ${limits.rating_score} digits allowed`,
      }))
      return
    }

    if (Number(value) > 99) {
      setErrors((prev) => ({
        ...prev,
        rating_score: 'Maximum value allowed is 99',
      }))
      return
    }

    const isScoreDuplicate = isDuplicateValue('rating_score', value)

    // Clear error if valid
    setErrors((prev) => ({
      ...prev,
      rating_score: isScoreDuplicate ? 'Score already exists' : '',
    }))

    updateScore(value)
  }

  const handleRemarkChange = (checked: boolean) => {
    setFormData((prev) => ({
      ratings: {
        ...prev.ratings,
        is_remarks_mandatory: checked,
      },
    }))
  }

  const validateFields = () => {
    const newErrors: RatingErrors = {}

    if (!formData.ratings.rating_title.trim()) {
      newErrors.rating_title = 'Title is required'
    } else if (
      isDuplicateValue('rating_title', formData.ratings.rating_title)
    ) {
      newErrors.rating_title = 'Title already exists'
    }
    if (!formData.ratings.rating_description.trim()) {
      newErrors.rating_description = 'Description is required'
    } else if (
      isDuplicateValue(
        'rating_description',
        formData.ratings.rating_description
      )
    ) {
      newErrors.rating_description = 'Description already exists'
    }
    if (!formData.ratings.rating.trim()) {
      newErrors.rating = 'Rating name is required'
    } else if (isDuplicateValue('rating', formData.ratings.rating)) {
      newErrors.rating = 'Rating already exists'
    }
    if (!formData.ratings.rating_score.trim()) {
      newErrors.rating_score = 'Score is required'
    } else if (
      isDuplicateValue('rating_score', formData.ratings.rating_score)
    ) {
      newErrors.rating_score = 'Score already exists'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // -----------------------------
  // Save API Integration
  // -----------------------------
  const handleSave = async () => {
    if (!validateFields()) {
      return
    }
    try {
      if (iseditMode) {
        if (!formData.ratings.id) return
        const updatePayload = {
          ratings: {
            ...formData.ratings,
            rating_for: formData.ratings.rating_for || ratingFor || '',
          },
        }
        const response = await updateNewRatingApi(updatePayload).unwrap()
        showSuccessToast(response?.message)
      } else {
        const response = await addNewRatingApi({
          ratings: {
            ...formData.ratings,
            id: null,
          },
        }).unwrap()
        showSuccessToast(response?.message)
      }

      onSuccess()
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      showErrorToast(err?.detail)
    }
  }

  useEffect(() => {
    if (onRegisterSave) {
      onRegisterSave(handleSave)
    }
  }, [onRegisterSave, handleSave])

  const handleRatingChange = (value: string) => {
    if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        rating: 'Only alphanumeric values are allowed',
      }))
      return
    }

    if (value.length > limits.rating) {
      setErrors((prev) => ({
        ...prev,
        rating: `Maximum ${limits.rating} characters allowed`,
      }))
      return
    }

    const isRatingDuplicate = isDuplicateValue('rating', value)

    setErrors((prev) => ({
      ...prev,
      rating: isRatingDuplicate ? 'Rating already exists' : '',
    }))

    updateField('rating', value)
  }

  // -----------------------------
  // Pre-fill form in edit mode
  // -----------------------------
  useEffect(() => {
    if (!iseditMode) {
      setFormData((prev) => ({
        ratings: {
          ...prev.ratings,
          rating_for: ratingFor || '',
        },
      }))
    }
    if (iseditMode && editData) {
      setFormData({
        ratings: {
          ...editData, // editData includes id for update
          rating_for: editData.rating_for || ratingFor || '',
          is_remarks_mandatory: editData.is_remarks_mandatory ?? false,
        },
      })
    }
  }, [iseditMode, editData, ratingFor])

  useEffect(() => {
    if (!onDirtyChange || !iseditMode || !editData) return

    const current = {
      rating_title: formData.ratings.rating_title?.trim() || '',
      rating_description: formData.ratings.rating_description?.trim() || '',
      rating: formData.ratings.rating?.trim() || '',
      rating_score: String(formData.ratings.rating_score ?? '').trim(),
      is_remarks_mandatory: !!formData.ratings.is_remarks_mandatory,
      rating_for: formData.ratings.rating_for || ratingFor || '',
    }

    const initial = {
      rating_title: editData.rating_title?.trim() || '',
      rating_description: editData.rating_description?.trim() || '',
      rating: editData.rating?.trim() || '',
      rating_score: String(editData.rating_score ?? '').trim(),
      is_remarks_mandatory: !!editData.is_remarks_mandatory,
      rating_for: editData.rating_for || ratingFor || '',
    }

    const isDirty =
      current.rating_title !== initial.rating_title ||
      current.rating_description !== initial.rating_description ||
      current.rating !== initial.rating ||
      current.rating_score !== initial.rating_score ||
      current.is_remarks_mandatory !== initial.is_remarks_mandatory ||
      current.rating_for !== initial.rating_for

    onDirtyChange(isDirty)
  }, [formData, iseditMode, editData, ratingFor, onDirtyChange])

  if (layout === 'form') {
    return (
      <>
        <Row className="">
          <Col md={6}>
            <div className="d-flex flex-wrap mb-3 mt-3 gap-3">
              <Form.Check
                type="checkbox"
                label="Is Remark Mandatory"
                checked={formData.ratings.is_remarks_mandatory}
                onChange={(e) => handleRemarkChange(e.target.checked)}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="goalNameLabel">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="font14 font400 fontOnest mb-0">Title</label>

              <span className="font12 font400 fontOnest">
                {formData.ratings.rating_title.length}/{limits.rating_title}
              </span>
            </div>
            <CommonInput
              className="TitleInput"
              // label="Title"
              placeholder="Please enter title"
              width="100%"
              value={formData.ratings.rating_title}
              onChange={(e) => updateField('rating_title', e.target.value)}
            />
            {errors.rating_title && (
              <div
                className="text-danger"
                style={{ fontSize: '12px', marginTop: '4px' }}
              >
                {errors.rating_title}
              </div>
            )}
          </Col>
        </Row>
        <Row className="py-3">
          <Col lg={6} className="goalNameLabel">
            <CommonInput
              className="TitleInput"
              label="Rating"
              placeholder="Rating"
              width="100%"
              value={formData.ratings.rating}
              onChange={(e) => handleRatingChange(e.target.value)}
            />
            {errors.rating && (
              <div
                className="text-danger"
                style={{ fontSize: '12px', marginTop: '4px' }}
              >
                {errors.rating}
              </div>
            )}
          </Col>
          <Col lg={6} className="goalNameLabel">
            <CommonInput
              className="TitleInput"
              label="Score"
              placeholder="Score"
              width="100%"
              value={formData.ratings.rating_score}
              onChange={(e) => handleScoreChange(e.target.value)}
            />
            {errors.rating_score && (
              <div
                className="text-danger"
                style={{ fontSize: '12px', marginTop: '4px' }}
              >
                {errors.rating_score}
              </div>
            )}
          </Col>
        </Row>
        <Row className="py-1">
          <Col lg={12} className="goalNameLabel">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="font14 font400 fontOnest mb-0">
                Description
              </label>

              <span className="font12 font400 fontOnest">
                {formData.ratings.rating_description.length}/
                {limits.rating_description}
              </span>
            </div>

            <textarea
              className="form-control TitleInput"
              placeholder="Please enter Description"
              rows={4}
              value={formData.ratings.rating_description}
              onChange={(e) =>
                updateField('rating_description', e.target.value)
              }
            />

            {errors.rating_description && (
              <div
                className="text-danger"
                style={{ fontSize: '12px', marginTop: '4px' }}
              >
                {errors.rating_description}
              </div>
            )}
          </Col>
        </Row>
      </>
    )
  }

  return (
    <tr>
      {/* TITLE */}
      <td>
        <input
          className="form-control"
          placeholder="Please enter"
          value={formData.ratings.rating_title}
          onChange={(e) => updateField('rating_title', e.target.value)}
        />
        {errors.rating_title && (
          <div
            className="text-danger"
            style={{ fontSize: '12px', marginTop: '4px' }}
          >
            {errors.rating_title}
          </div>
        )}
      </td>

      {/* DESCRIPTION */}
      <td>
        <input
          className="form-control"
          placeholder="Please enter"
          value={formData.ratings.rating_description}
          onChange={(e) => updateField('rating_description', e.target.value)}
        />
        {errors.rating_description && (
          <div
            className="text-danger"
            style={{ fontSize: '12px', marginTop: '4px' }}
          >
            {errors.rating_description}
          </div>
        )}
      </td>

      {/* RATING NAME */}
      <td>
        <input
          className="form-control"
          placeholder="Rating"
          value={formData.ratings.rating}
          onChange={(e) => handleRatingChange(e.target.value)}
        />
        {errors.rating && (
          <div
            className="text-danger"
            style={{ fontSize: '12px', marginTop: '4px' }}
          >
            {errors.rating}
          </div>
        )}
      </td>

      {/* SCORE */}
      <td>
        <input
          className="form-control"
          placeholder="Score"
          value={formData.ratings.rating_score}
          onChange={(e) => handleScoreChange(e.target.value)}
        />

        {errors.rating_score && (
          <div
            className="text-danger"
            style={{ fontSize: '12px', marginTop: '4px' }}
          >
            {errors.rating_score}
          </div>
        )}
      </td>

      {/* REMARK */}

      <td>
        <div style={{ padding: '0px 30px' }}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <input
            type="checkbox"
            className="checkBox"
            checked={formData.ratings.is_remarks_mandatory}
            onChange={(e) => handleRemarkChange(e.target.checked)}
          />
        </div>
      </td>

      {/* ACTIONS */}
      <td style={{ display: 'flex', gap: '10px' }}>
        <div className="d-flex gap-3">
          <button
            className="transparentButton"
            onClick={handleSave}
            type="button"
          >
            <img src={SaveIcon} alt="save" />
          </button>

          <button
            className="transparentButton"
            onClick={onCancel}
            type="button"
          >
            <img src={CancelIcon} alt="cancel" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default AddRatingRow
