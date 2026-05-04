/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useRef, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AddIcon from '@project/assets/images/AddIcon.png'
import DeleteIcon from '@project/assets/images/Delete.svg'
import CommonInput from '@project/Common/CommonInput/CommonInput'
import SharedButton from '@project/Components/Button/SharedButton'
import TableResponsive from '@project/Components/TableResponsive/TableResponsive'
import {
  useAddNewRatingMutation,
  useUpdateRatingMutation,
} from '@project/Store/Api/Admin/Ratings/rating'
import { AddNewRatingRequest, Ratings } from '@project/Types/rating'
import stringNormalize from '@project/Utils/duplicate'

import '@project/Pages/Admin/Rating/Employee/employeeRating.scss'

type RatingFormProps = {
  show: boolean
  closeForm?: () => void
  onSuccess?: () => void
  ratingFor: string
  editData?: Ratings | null
  data?: Ratings[]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: any = {
  id: null,
  rating_for: '',
  rating_name: '',
  rating_title: '',
  rating_description: '',
  rating_points: [
    {
      id: null,
      rating_points: '',
    },
  ],
}

type RatingPointErrors = Record<number, string>

type Error = {
  rating_name?: string
  rating_title?: string
  rating_description?: string
  rating_points?: RatingPointErrors
}

function EmployeeRatingForm({
  show,
  closeForm,
  onSuccess,
  ratingFor,
  editData,
  data,
}: RatingFormProps) {
  const [formData, setFormData] = useState<Ratings>(initialState)
  const [addRating, { isLoading: addLoading }] = useAddNewRatingMutation()
  const [updateRating, { isLoading: updateLoading }] = useUpdateRatingMutation()
  const [errors, setErrors] = useState<Error>({})
  const ratingPointsRef = useRef<HTMLTableSectionElement>(null)

  useEffect(() => {
    if (editData) {
      setFormData(editData)
    } else {
      setFormData(initialState)
    }
  }, [editData])

  // Add a new empty rating point
  const addRatingPoint = () => {
    setFormData((prev) => ({
      ...prev,
      rating_points: [...prev.rating_points, { id: null, rating_points: '' }],
    }))

    setTimeout(() => {
      if (ratingPointsRef.current) {
        ratingPointsRef.current.scrollTo({
          top: ratingPointsRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 100)
  }

  // Remove rating point by index
  const removeRatingPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rating_points: prev.rating_points.filter((_, i) => i !== index),
    }))
  }

  // Handle input change for rating_points
  const handleRatingPointChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target
    setFormData((prev) => {
      const updatedPoints = [...prev.rating_points]
      updatedPoints[index] = { ...updatedPoints[index], rating_points: value }

      const otherPoints = updatedPoints
        .filter((_, i) => i !== index)
        .map((p) => p.rating_points.trim().toLowerCase())

      const isDuplicateInForm = otherPoints.includes(value.trim().toLowerCase())

      const isDuplicateInData = data?.some((d) =>
        d.rating_points.some(
          (p) =>
            p.rating_points.trim().toLowerCase() === value.trim().toLowerCase()
        )
      )
      let errorMsg = ''
      if (isDuplicateInForm) {
        errorMsg = 'This rating point is already added in this form'
      } else if (isDuplicateInData) {
        errorMsg = 'This rating point already exists'
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        rating_points: {
          ...(prevErrors.rating_points || {}),
          [index]: errorMsg,
        },
      }))

      return {
        ...prev,
        rating_points: updatedPoints,
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    const formattedName = name
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase())

    const isDuplicate = data?.some(
      (item) =>
        (name === 'rating_name' &&
          stringNormalize(item.rating_name) === stringNormalize(value)) ||
        (name === 'rating_title' &&
          stringNormalize(item.rating_title) === stringNormalize(value)) ||
        (name === 'rating_description' &&
          stringNormalize(item.rating_description) === stringNormalize(value))
    )

    setErrors((prev) => ({
      ...prev,
      [name]: isDuplicate ? `${formattedName} already exists` : undefined,
    }))

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    const ratingPayload: AddNewRatingRequest = {
      ratings: { ...formData, rating_for: ratingFor },
    }

    let api
    if (editData) {
      api = updateRating({ ...ratingPayload })
    } else {
      api = addRating({ ...ratingPayload })
    }

    api.unwrap().then(() => {
      if (onSuccess) onSuccess()
      if (!editData) {
        setFormData(initialState)
      }
    })
  }

  const isFormValid = () => {
    const { rating_name, rating_title, rating_description, rating_points } =
      formData
    const lastPoint =
      rating_points[rating_points.length - 1]?.rating_points.trim()

    const errorValues = [
      errors.rating_name,
      errors.rating_title,
      errors.rating_description,
      ...(errors.rating_points ? Object.values(errors.rating_points) : []),
    ]

    const hasErrors = errorValues.some((err) => err)

    return (
      rating_name.trim() !== '' &&
      rating_title.trim() !== '' &&
      rating_description.trim() !== '' &&
      lastPoint !== '' &&
      !hasErrors
    )
  }

  return (
    <Modal
      show={show}
      onHide={closeForm}
      centered
      size="lg"
      dialogClassName="custom-modal"
    >
      <Row className="addNewGoalMain">
        <Col lg={12} className="addNewGoalHead">
          <div>
            <h3 className="font16 addNewGoalText">
              {editData ? 'Update rating' : 'Add rating'}
            </h3>
          </div>
        </Col>
        <Col className="whiteBg">
          <Row>
            <Col lg={6} className="py-3">
              <CommonInput
                label="Rating name"
                placeholder="Please enter rating name"
                width="100%"
                name="rating_name"
                value={formData.rating_name}
                onChange={handleChange}
              />
              {errors.rating_name && (
                <p className="error-text textRed mb-0">{errors.rating_name}</p>
              )}
            </Col>
            <Col lg={6} className="py-3">
              <CommonInput
                label="Rating title"
                placeholder="Please enter rating title"
                width="100%"
                name="rating_title"
                value={formData.rating_title}
                onChange={handleChange}
              />
              {errors.rating_title && (
                <p className="error-text textRed mb-0">{errors.rating_title}</p>
              )}
            </Col>
            <Col lg={12} className="py-3">
              <CommonInput
                label="Rating description"
                placeholder="Please enter description"
                width="100%"
                name="rating_description"
                value={formData.rating_description}
                onChange={handleChange}
              />
              {errors.rating_description && (
                <p className="error-text textRed mb-0">
                  {errors.rating_description}
                </p>
              )}
            </Col>
          </Row>
          <Row className="d-flex align-items-center py-3 px-2">
            <Col lg={9}>
              <p className="font16 font400 fontOnest primaryColor m b-0">
                Rating Points
              </p>
            </Col>
            {editData && (
              <Col lg={3}>
                <button
                  className="add-btn primaryBgColor textWhite addMore"
                  onClick={addRatingPoint}
                >
                  <img src={AddIcon} alt="Add" /> Add More
                </button>
              </Col>
            )}
          </Row>
          <div className="userTableMain">
            <TableResponsive maxHeight="35vh" containerRef={ratingPointsRef}>
              <table className="table manageWeightageTable">
                <thead className="custom-thead">
                  <tr className="custom-thead-row">
                    <th scope="col-8" className="custom-th font14 font400 w-75">
                      <div className="d-flex align-items-center gap-2 ">
                        <span className="onest-regular-14">Rating points</span>
                      </div>
                    </th>
                    <th scope="col-4" className="custom-th font14 font400 w-25">
                      <div className="d-flex align-items-center gap-2">
                        <span className="onest-regular-14">Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.rating_points.map((point, i) => (
                    <tr className="custom-row">
                      <td className="manageWeightage">
                        <CommonInput
                          value={point.rating_points}
                          onChange={(e) => handleRatingPointChange(i, e)}
                          placeholder={`Rating Point ${i + 1}`}
                          width="100%"
                          height="40px"
                        />
                        {errors.rating_points?.[i] && (
                          <p className="error-text textRed mb-0">
                            {errors.rating_points[i]}
                          </p>
                        )}
                      </td>
                      <td className="manageWeightage">
                        {editData && (
                          <button
                            className="add-btn whiteBg textRed deleteBtn addMore"
                            onClick={() => removeRatingPoint(i)}
                            disabled={formData.rating_points.length === 1}
                          >
                            <img src={DeleteIcon} alt="Delete" /> Delete
                          </button>
                        )}

                        {!editData &&
                          i === formData.rating_points.length - 1 && (
                            <button
                              className="add-btn primaryBgColor textWhite addMore"
                              disabled={!point.rating_points.trim()}
                              onClick={addRatingPoint}
                            >
                              <img src={AddIcon} alt="Add" /> Add More
                            </button>
                          )}

                        {!editData &&
                          i !== formData.rating_points.length - 1 && (
                            <button
                              className="add-btn whiteBg textRed deleteBtn addMore"
                              onClick={() => removeRatingPoint(i)}
                            >
                              <img src={DeleteIcon} alt="Delete" /> Delete
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableResponsive>
          </div>
        </Col>
        <Modal.Footer className="border-0 justify-content-start">
          <div className="d-flex gap-3">
            <SharedButton
              label="Cancel"
              onClick={() => {
                if (onSuccess) onSuccess()
                setErrors({})
                if (editData) {
                  setFormData(editData)
                } else {
                  setFormData(initialState)
                }
              }}
            />
            <SharedButton
              label={editData ? 'Update' : 'Add'}
              onClick={handleSubmit}
              disabled={!isFormValid() || addLoading || updateLoading}
              loading={addLoading || updateLoading}
            />
          </div>
        </Modal.Footer>
      </Row>
    </Modal>
  )
}

export default EmployeeRatingForm
