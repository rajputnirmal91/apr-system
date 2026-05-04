/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import SrmDetailsTab from '@project/Pages/ManagerVersion/SrmDetailsTab'
import TeamMember from '@project/Pages/ManagerVersion/TeamMember/TeamMember'

type SRMRouteProps = {
  root: string
  dashboard: string
  projectDetails: string
  profile: string
  srmDetailsTab: string
}

function SRMRoutes(route: SRMRouteProps) {
  return (
    <>
      <Route path={route.dashboard} element={<TeamMember />} />
      <Route path={route.srmDetailsTab} element={<SrmDetailsTab />} />
      <Route
        path="srmDetailsTab/:employee_user_id"
        element={<SrmDetailsTab />}
      />
    </>
  )
}

export default SRMRoutes
