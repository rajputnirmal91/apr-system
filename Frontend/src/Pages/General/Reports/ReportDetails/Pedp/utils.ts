import moment from 'moment'

import type { UpdateDeadlineRequest } from '@project/Types/reports'

type Deadline = {
  event: string
  date: Date
  status?: string
}

type FormReviewDeadlineDetails = {
  pedp_form_publish_date?: string
  employee_submission_deadline?: string
  employee_submission_status?: string
  srm_submission_deadline?: string
  srm_submission_status?: string
  director_engineer_submission_deadline?: string
  director_engineer_status?: string
  irm_submission_deadline?: string
  irm_submission_status?: string
  unit_head_submission_deadline?: string
  unit_head_submission_status?: string
  hr_submission_deadline?: string
  hr_submission_status?: string
  management_submission_deadline?: string
  management_submission_status?: string
} | null

type AppraiserRatingRemark = {
  appraiser_name?: string | null
  appraiser_rating?: string | null
  appraiser_remarks?: string | null
}

type SubKraWithRatings = {
  appraisee_remarks?: string | null
  appraisers_rating_remarks?: AppraiserRatingRemark[]
}

type IrmHeader = {
  appraiserName: string
  label: string
}

const createDefaultDeadlines = (): Deadline[] => [
  {
    event: 'Publish appraisal form',
    date: moment('2025-03-01').toDate(),
    status: 'Pending',
  },
  {
    event: 'Employee submission',
    date: moment('2025-03-07').toDate(),
    status: 'Pending',
  },
  {
    event: 'HR',
    date: moment('2025-03-07').toDate(),
    status: 'Pending',
  },
  { event: 'IRM', date: moment('2025-03-07').toDate(), status: 'Pending' },
  { event: 'SRM', date: moment('2025-03-07').toDate(), status: 'Pending' },
  {
    event: 'Direct Engineer',
    date: moment('2025-03-07').toDate(),
    status: 'Pending',
  },
  {
    event: 'Unit Head',
    date: moment('2025-03-07').toDate(),
    status: 'Pending',
  },
  {
    event: 'Management',
    date: moment('2025-03-07').toDate(),
    status: 'Pending',
  },
]

const createDeadlinesFromFormReview = (
  formReviewDeadline: FormReviewDeadlineDetails
): Deadline[] => {
  if (!formReviewDeadline) return createDefaultDeadlines()

  const publishDate = moment(formReviewDeadline.pedp_form_publish_date)

  return [
    {
      event: 'Publish appraisal form',
      date: publishDate.toDate(),
      status: publishDate.isAfter(moment()) ? 'Completed' : 'Pending',
    },
    {
      event: 'Employee submission',
      date: moment(formReviewDeadline.employee_submission_deadline).toDate(),
      status: formReviewDeadline.employee_submission_status,
    },
    {
      event: 'HR',
      date: moment(formReviewDeadline.hr_submission_deadline).toDate(),
      status: formReviewDeadline.hr_submission_status,
    },
    {
      event: 'IRM',
      date: moment(formReviewDeadline.irm_submission_deadline).toDate(),
      status: formReviewDeadline.irm_submission_status,
    },
    {
      event: 'SRM',
      date: moment(formReviewDeadline.srm_submission_deadline).toDate(),
      status: formReviewDeadline.srm_submission_status,
    },
    {
      event: 'Direct Engineer',
      date: moment(
        formReviewDeadline.director_engineer_submission_deadline
      ).toDate(),
      status: formReviewDeadline.director_engineer_status,
    },
    {
      event: 'Unit Head',
      date: moment(formReviewDeadline.unit_head_submission_deadline).toDate(),
      status: formReviewDeadline.unit_head_submission_status,
    },

    {
      event: 'Management',
      date: moment(formReviewDeadline.management_submission_deadline).toDate(),
      status: formReviewDeadline.management_submission_status,
    },
  ]
}

const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const buildUpdateDeadlinesPayload = (
  employeeUserId: string,
  deadlines: Deadline[]
): UpdateDeadlineRequest => ({
  employee_user_id: employeeUserId,
  dates: {
    PublishDate: formatDateToYMD(deadlines[0]?.date),
    EmployeeDate: formatDateToYMD(deadlines[1]?.date),
    // ManagerDate: formatDateToYMD(deadlines[2]?.date),
    HRDate: formatDateToYMD(deadlines[2]?.date),
    IRMDate: formatDateToYMD(deadlines[3]?.date),
    SRMDate: formatDateToYMD(deadlines[4]?.date),
    DirectorEngineerDate: formatDateToYMD(deadlines[5]?.date),
    UnitHeadDate: formatDateToYMD(deadlines[6]?.date),
    ManagementDate: formatDateToYMD(deadlines[7]?.date),
  },
})

const normalizeName = (name?: string | null): string =>
  (name || '').trim().replace(/\s+/g, ' ')

export const getIrmInitials = (name?: string | null): string => {
  const parts = normalizeName(name).split(' ').filter(Boolean)

  if (!parts.length) return 'IRM'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const getKraIrmHeaders = (subKras: SubKraWithRatings[] = []): IrmHeader[] => {
  const uniqueAppraisers = new Map<string, string>()
  const initialsCount = new Map<string, number>()

  subKras.forEach((subKra) => {
    subKra?.appraisers_rating_remarks?.forEach((item) => {
      const appraiserName = normalizeName(item?.appraiser_name) || 'HR'
      const key = appraiserName.toLowerCase()

      if (!uniqueAppraisers.has(key)) {
        uniqueAppraisers.set(key, appraiserName)
      }
    })
  })

  return Array.from(uniqueAppraisers.values()).map((name) => {
    const initials = getIrmInitials(name)
    const count = (initialsCount.get(initials) || 0) + 1
    initialsCount.set(initials, count)

    return {
      appraiserName: name,
      label:
        count === 1
          ? `Appraiser (${initials})`
          : `Appraiser ${count} (${initials})`,
    }
  })
}

const getAppraiseeRemark = (subKra: SubKraWithRatings): string =>
  subKra?.appraisee_remarks || 'No remarks'

const getIrmRatingByName = (
  subKra: SubKraWithRatings,
  appraiserName: string
): string => {
  const ratings = subKra?.appraisers_rating_remarks || []
  const matchedRating = ratings.find(
    (item) =>
      (normalizeName(item?.appraiser_name) || 'HR').toLowerCase() ===
      appraiserName.toLowerCase()
  )

  return matchedRating?.appraiser_rating || '-'
}

const getIrmRemarkByName = (
  subKra: SubKraWithRatings,
  appraiserName: string
): string => {
  const ratings = subKra?.appraisers_rating_remarks || []

  const matched = ratings.find(
    (item) =>
      (normalizeName(item?.appraiser_name) || 'HR').toLowerCase() ===
      appraiserName.toLowerCase()
  )

  return matched?.appraiser_remarks || 'No remarks'
}

export type { Deadline, FormReviewDeadlineDetails, SubKraWithRatings }
export {
  buildUpdateDeadlinesPayload,
  createDeadlinesFromFormReview,
  createDefaultDeadlines,
  getAppraiseeRemark,
  getIrmRatingByName,
  getIrmRemarkByName,
  getKraIrmHeaders,
}
