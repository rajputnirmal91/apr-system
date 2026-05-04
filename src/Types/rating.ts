type RatingPoints = {
  id: string | null
  rating_points: string
}

type RatingPointsRequest = {
  id: string
  rating_points: RatingPoints[]
}

type Ratings = {
  id: string | null
  rating_for: string
  rating_name: string
  rating_title: string
  rating_description: string
  rating: string
  rating_score: string
  rating_points: RatingPoints[]
  is_remarks_mandatory: boolean
}

type AddNewRatingRequest = {
  ratings: Ratings
}

type RatingsNew = {
  id: string | null
  rating_score: string
  rating_title: string
  rating: string
  rating_description: string
  is_remarks_mandatory: boolean
  rating_for: string
}

type AddRatingRequestNew = {
  ratings: RatingsNew
}

type AddNewRatingResponse = {
  message: string
  data: {
    detail: string
  }
}

type DeleteRatingRequest = {
  id: string | null
  is_deleted: boolean
}

type DeleteRatingResponse = {
  message: string
}

type GetRatingListRequest = {
  page: number
  limit: number
  search: string
  rating_for: string
}

type GetRatingListRequestNew = {
  page: number
  limit: number
  search: string
  order_by: string
  sort_by: string
  rating_for?: string
}

type GetRatingListResponse = {
  message: string
  total_count: number
  page: number
  ratings: Ratings[]
}

type RatingUpdateRequest = {
  ratings: Ratings
}

type RatingUpdateResponse = {
  message: string
  rating: {
    id: string
    rating_for: string
    rating_name: string
    score: number
  }
}

// -----------------------------
// New types for AddRatingPoints component / Formik
// -----------------------------

// Formik values for AddRatingPoints
type RatingPointsFormValues = {
  id: string | null
  rating_points: RatingPoints[]
}

// API Error type
type ApiError = {
  status: number
  data: {
    detail?: string
    message?: string
    [key: string]: unknown
  }
}

// Optional helper type for FieldArray / editable points
type RatingPointEditable = {
  id: string | null
  rating_points: string
}

// Optional delete handler type
type DeleteRatingPointHandler = (id: string) => void

type checkDuplicateRatingRequest = {
  rating_for: string
  rating_title: string
  id?: string | null
}

type checkDuplicateRatingResponse = {
  message: string
}

export type {
  AddNewRatingRequest,
  AddNewRatingResponse,
  AddRatingRequestNew,
  ApiError,
  checkDuplicateRatingRequest,
  checkDuplicateRatingResponse,
  DeleteRatingPointHandler,
  DeleteRatingRequest,
  DeleteRatingResponse,
  GetRatingListRequest,
  GetRatingListRequestNew,
  GetRatingListResponse,
  RatingPointEditable,
  RatingPoints,
  RatingPointsFormValues,
  RatingPointsRequest,
  Ratings,
  RatingsNew,
  RatingUpdateRequest,
  RatingUpdateResponse,
}
