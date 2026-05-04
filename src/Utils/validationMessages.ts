import * as Yup from 'yup'

import type { PublishSubmissionType } from '@project/Types/DateTypes'

export default {
  email: {
    required: 'Please enter your email address.',
    invalid: 'Please enter a valid email address.',
    max: 'Email should be maximum 62 character.',
    noSpaceRequired: 'Email cannot include spaces.',
  },
  password: {
    required: 'Please enter new password.',
    requiredPass: 'Please enter password.',
    invalid:
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.',
    max: 'Password should be maximum 32 characters.',
    oldPassword: 'Please enter old password.',
  },
}

export const certificationValidationSchema = Yup.object({
  name_of_certificate: Yup.string()
    .required('Certification name is required')
    .min(3, 'Certification name must be at least 3 characters'),
  subject_name: Yup.string()
    .required('Subject name is required')
    .min(2, 'Subject name must be at least 2 characters'),
  certification_start_date: Yup.date().required('Start date is required'),
  certification_end_date: Yup.date()
    .required('End date is required')
    .min(
      Yup.ref('certification_start_date'),
      'End date must be after start date'
    ),
  remarks: Yup.string().max(500, 'Remarks must be less than 500 characters'),
  attachment_url: Yup.mixed()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true
      if (value instanceof File) return value.size <= 5 * 1024 * 1024
      return true
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true
      if (value instanceof File)
        return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          value.type
        )
      return true
    }),
})

export const validationSchema = Yup.object({
  employeeStatus: Yup.string().required('Employee status is required'),
  nameOfProject: Yup.string().required('Employee Project Name is required'),
  clientName: Yup.string().required('Client name is required'),
  mode: Yup.string().required('Mode is required'),
  role: Yup.string().required('Role is required'),
  immediateManager: Yup.string().required('Immediate manager is required'),
})

export const validationSchemaCDP = Yup.object({
  cdp: Yup.array().of(
    Yup.object().shape({
      strength: Yup.string().required('Strength is required'),
      developmentNeed: Yup.string().required('Development need is required'),
      trainingNeed: Yup.string().required('Training need is required'),
      hours: Yup.string()
        .required('Hours are required')
        .matches(/^[1-9]\d*$/, 'Enter a valid positive number'),
    })
  ),
})

export const submissionTypeMap: Record<PublishSubmissionType, string> = {
  PublishDate: 'Publish appraisal form',
  EmployeeDate: 'Last date for submission by Employee',
  HRDate: 'Last date for submission by HR',
  // ManagerDate: 'Last date for submission by Manager',
  IRMDate: 'Last date for submission by IRM',
  SRMDate: 'Last date for submission by SRM',
  DirectorEngineerDate: 'Last date for submission by Director Engineer',
  UnitHeadDate: 'Last date for submission by Unit Head',
  ManagementDate: 'Last date for submission by Management',
}
