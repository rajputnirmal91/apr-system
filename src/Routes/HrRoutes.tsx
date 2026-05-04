import { Route } from 'react-router-dom'

import ReportDetails from '@project/Pages/General/Reports/ReportDetails/ReportDetails'
import Reports from '@project/Pages/General/Reports/Reports'
import NoRecordFound from '@project/Components/NoRecordFound/NoRecordFound'
import EmployeeEligibility from '@project/Pages/Hr/EmployeeEligibility/EmployeeEligibility'
import EmailTemplate from '@project/Pages/Hr/EmailTemplate/EmailTemplate'
import HrDashboard from '@project/Pages/Hr/HrDashboard/HrDashboard'
import HrEmpDetails from '@project/Pages/Hr/HrDashboard/HrEmpDetails/HrEmpDetails'

type HrRoutesProps = {
  root: string
  dashboard: string
  hrReviews: string
  details: string
  reportsDashboard: string
  reportDetails: string
  employeeEligibility: string
  emailTemplate: string
  emailTemplateNew: string
  emailTemplateSent: string
  emailTemplateDraft: string
}

function HrRoutes(route: HrRoutesProps) {
  return (
    <>
      <Route
        path={route.dashboard}
        element={
          <NoRecordFound
            heading="Dashboard"
            description="In progress to build — stay tuned, coming soon."
          />
        }
      />
      <Route path={route.hrReviews} element={<HrDashboard />} />
      <Route path="hr-emp-details/:employeeUserId" element={<HrEmpDetails />} />
      <Route path={route.reportsDashboard} element={<Reports />} />
      <Route path={route.reportDetails} element={<ReportDetails />} />
      <Route path="employee-eligibility" element={<EmployeeEligibility />} />
      <Route path="email-template" element={<EmailTemplate tab="sent" />} />
      <Route path="email-template/new" element={<EmailTemplate tab="new" />} />
      <Route path="email-template/sent" element={<EmailTemplate tab="sent" />} />
      <Route path="email-template/draft" element={<EmailTemplate tab="draft" />} />
    </>
  )
}

export default HrRoutes
