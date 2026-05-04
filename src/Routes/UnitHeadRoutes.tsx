/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import Profile from '@project/Pages/Common/Profile/Profile'
import DashboardDetail from '@project/Pages/UnitHead/DashboardDetail/DashboardDetail'
import Help from '@project/Pages/UnitHead/DashboardDetail/Help/Help'
import UnitHeadDashboard from '@project/Pages/UnitHead/UnitHeadDashboard/UnitHeadDashboard'

type UnitHeadRoutesProps = {
  root: string
  dashboard: string
  dashboardDetails: string
  profile: string
  help: string
}

function UnitHeadRoutes(route: UnitHeadRoutesProps) {
  return (
    <>
      <Route path={route.dashboard} element={<UnitHeadDashboard />} />
      <Route
        path={`${route.dashboardDetails}/:employeeUserId`}
        element={<DashboardDetail />}
      />

      <Route path={route.profile} element={<Profile userRole="Unit head" />} />
      <Route path={route.help} element={<Help />} />
    </>
  )
}

export default UnitHeadRoutes
