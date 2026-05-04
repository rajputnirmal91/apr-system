export const SUCCESSSTATUS = 200
export const ERRORSTATUS = 400
export const UNAUTHORIZED_STATUS = 401
export const FAILEDSTATUS = 500
export const CONFLICT_STATUS = 409
export const POST = 'POST'

export const MODE_OF_PROJECT_HANDELING = [
  { label: 'Individual', value: 'Individual' },
  { label: 'Team', value: 'Team' },
]

export const roles = [
  'Project Manager',
  'Product Manager',
  'Business Analyst',
  'UI Designer',
  'UX Designer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'QA Engineer',
]

export const ROLE_IN_TEAM = roles.map((role) => ({
  label: role,
  value: role,
}))
