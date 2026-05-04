const authRoutes = {
  root: '/',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
}

const adminRoutes = {
  root: 'admin',
  dashboard: 'dashboard',
  goalsAssociation: 'goals-association',
  master: 'master',
  rating: 'rating',
  employeeEligibility: 'employee-eligibility',
  reports: 'reports',
  reportDetails: 'reports-details/:employee_name',
  global: 'global',
  custom: 'custom',
  profile: 'profile',
  goalMapping: 'goals-mapping',
  goal: 'goal',
  kra: 'kra',
  appraisal: 'appraisal',
  milestones: 'milestones',
  goals: 'goals',
  goalMaster: 'master-goal',
  listOfGoal: 'list-of-goal',
  list: 'list',
  emailTemplate: 'email-template',
  sessionMaster: 'sessionMaster',
  accessPermission: 'access-permission',
}

const employeeRoutes = {
  root: 'employee',
  dashboard: 'employee-dashboard',
  pedp: 'pedp',
  projectDetails: 'projectdetails',
  certification: 'certification',
  help: 'pedp-help',
  profile: 'profile',
}

const srmRoutes = {
  root: 'srm',
  dashboard: 'srm-dashboard',
  srmDetailsTab: 'srmDetailsTab',
  projectDetails: 'projectDetails',
  profile: 'profile',
}

const irmRoutes = {
  root: 'irm',
  dashboard: 'irm-dashboard',
  irmDetailsTab: 'irmDetailsTab',
  irmPedpTab: 'irmPedpTab',
  irmProjectsTab: 'irmProjectsTab',
  IrmCertificationsTab: 'IrmCertificationsTab',
  irmHelp: 'irmHelp',
}

const unitHeadRoutes = {
  root: 'unit-head',
  dashboard: 'unit-head-dashboard',
  dashboardDetails: 'unit-head-dashboard-details',
  help: 'help',
  profile: 'profile',
}

const managementRoutes = {
  root: 'management',
  dashboard: 'management-dashboard',
  reviewRating: 'review-rating',
  reviewRatingDetails: 'review-rating-details',
  reports: 'reports',
  employeeEligibility: 'employee-eligibility',
  help: 'help',
  profile: 'profile',
}

const hrRoutes = {
  root: 'hr',
  dashboard: 'hr-dashboard',
  hrReviews: 'hr-reviews',
  details: 'hr-emp-details',
  reportsDashboard: 'hr-reports-dashboard',
  reportDetails: 'hr-reports-details/:empName',
  employeeEligibility: 'employee-eligibility',
  emailTemplate: 'email-template',
  emailTemplateNew: 'email-template/new',
  emailTemplateSent: 'email-template/sent',
  emailTemplateDraft: 'email-template/draft',
}

export {
  adminRoutes,
  authRoutes,
  employeeRoutes,
  hrRoutes,
  irmRoutes,
  managementRoutes,
  srmRoutes,
  unitHeadRoutes,
}
