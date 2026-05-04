/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import Profile from '@project/Pages/Common/Profile/Profile'
import ManagementDashboard from '@project/Pages/Management/Dashboard/Dashboard'
import EmployeeEligibility from '@project/Pages/Management/EmployeeEligibility/EmployeeEligibility'
import Reports from '@project/Pages/Management/Reports/Reports'
import Help from '@project/Pages/Management/ReviewRating/Help'
import ReviewDetails from '@project/Pages/Management/ReviewRating/RatingDetails/RatingDetails'
import ReviewRatings from '@project/Pages/Management/ReviewRating/ReviewRating'

type ManagementProps = {
  root: string
  dashboard: string
  reviewRating: string
  reviewRatingDetails: string
  reports: string
  employeeEligibility: string
  profile: string
  help: string
}

function ManagementRoutes(route: ManagementProps) {
  return (
    <>
      <Route path={route.dashboard} element={<ManagementDashboard />} />
      <Route path={route.reviewRating} element={<ReviewRatings />} />
      <Route path={route.reviewRatingDetails} element={<ReviewDetails />} />
      <Route
        path={`${route.reviewRatingDetails}/:employee_user_id`}
        element={<ReviewDetails />}
      />
      <Route path={route.reports} element={<Reports />} />
      <Route
        path={route.employeeEligibility}
        element={<EmployeeEligibility />}
      />
      <Route path={route.profile} element={<Profile userRole="Management" />} />
      <Route path={route.help} element={<Help />} />
    </>
  )
}

export default ManagementRoutes
