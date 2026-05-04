// Static mock data — replace with API calls in future

export interface EmailTemplateOption {
  label: string
  value: string
  subject: string
  body: string
}

export interface SentEmail {
  id: string
  to: string
  subject: string
  date: string
  status: 'Sent' | 'Failed' | 'Pending'
  from?: string
}

export interface DraftEmail {
  id: string
  to: string
  subject: string
  date: string
  status: 'Draft'
  from?: string
  // Full state for resume — optional so mock/static drafts still work
  resumeData?: {
    step: number
    subject: string
    body: string
    selectedTemplateValue: string | null
    selectedTemplateLabel?: string
    selectedUserIds: string[]
  }
}

export interface MockUser {
  id: string           // maps to employee_user_id
  name: string         // maps to employee_name
  employeeId: string   // maps to employee_lms_id
  designation: string  // maps to employee_designation
  email?: string       // maps to employee_email
}

export const EMAIL_TEMPLATES: EmailTemplateOption[] = [
  {
    label: 'Appraisal Reminder',
    value: 'appraisal-reminder',
    subject: 'Reminder: Complete Your Appraisal Form',
    body: `Dear [Employee Name],\n\nThis is a reminder to complete your appraisal form before the deadline.\n\nPlease log in to the system and submit your self-assessment at the earliest.\n\nRegards,\nHR Team`,
  },
  {
    label: 'Goal Setting Notification',
    value: 'goal-setting',
    subject: 'Action Required: Set Your Goals for This Cycle',
    body: `Dear [Employee Name],\n\nThe goal-setting window is now open. Please log in and define your goals for the current appraisal cycle.\n\nDeadline: [Deadline Date]\n\nRegards,\nHR Team`,
  },
  {
    label: 'Performance Review Invite',
    value: 'performance-review',
    subject: 'Performance Review Meeting Scheduled',
    body: `Dear [Employee Name],\n\nYour performance review has been scheduled. Please be prepared to discuss your achievements and areas of improvement.\n\nDate: [Meeting Date]\nTime: [Meeting Time]\n\nRegards,\nHR Team`,
  },
]

export const SENT_EMAILS: SentEmail[] = [
  {
    id: '1',
    to: 'All Employees',
    subject: 'Reminder: Complete Your Appraisal Form',
    date: '2026-03-10',
    status: 'Sent',
  },
  {
    id: '2',
    to: 'Engineering Team',
    subject: 'Action Required: Set Your Goals for This Cycle',
    date: '2026-03-08',
    status: 'Sent',
  },
  {
    id: '3',
    to: 'Design Team',
    subject: 'Performance Review Meeting Scheduled',
    date: '2026-03-05',
    status: 'Failed',
  },
  {
    id: '4',
    to: 'Product Team',
    subject: 'Reminder: Complete Your Appraisal Form',
    date: '2026-03-01',
    status: 'Pending',
  },
]

export const DRAFT_EMAILS: DraftEmail[] = [
  {
    id: 'd1',
    to: 'HR Team',
    subject: 'Goal Setting Notification - Draft',
    date: '2026-03-15',
    status: 'Draft',
  },
  {
    id: 'd2',
    to: 'All Managers',
    subject: 'Performance Review Invite - Draft',
    date: '2026-03-14',
    status: 'Draft',
  },
]

export const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Arvind Kumar', employeeId: 'EMP001', designation: 'Software Engineer' },
  { id: 'u2', name: 'Madhuri Singh', employeeId: 'EMP002', designation: 'Product Manager' },
  { id: 'u3', name: 'Rahul Sharma', employeeId: 'EMP003', designation: 'UI/UX Designer' },
  { id: 'u4', name: 'Priya Patel', employeeId: 'EMP004', designation: 'QA Engineer' },
  { id: 'u5', name: 'Vikram Nair', employeeId: 'EMP005', designation: 'DevOps Engineer' },
  { id: 'u6', name: 'Sneha Joshi', employeeId: 'EMP006', designation: 'Business Analyst' },
  { id: 'u7', name: 'Amit Verma', employeeId: 'EMP007', designation: 'Software Engineer' },
  { id: 'u8', name: 'Deepa Menon', employeeId: 'EMP008', designation: 'HR Executive' },
]


