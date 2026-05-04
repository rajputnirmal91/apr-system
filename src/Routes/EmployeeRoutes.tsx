/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import Profile from '@project/Pages/Common/Profile/Profile'
import Certification from '@project/Pages/Employee/Certification/Certification'
import EmployeeDashboard from '@project/Pages/Employee/EmployeeDashboard/EmployeeDashboard'
import Help from '@project/Pages/Employee/Pedp/Help'
import Pedp from '@project/Pages/Employee/Pedp/Pedp'
import Projects from '@project/Pages/Employee/ProjectDetails/ProjectDetails'

type EmployeeRouteProps = {
  root: string
  dashboard: string
  pedp: string
  projectDetails: string
  certification: string
  help: string
  profile: string
}

function EmployeeRoutes(route: EmployeeRouteProps) {
  return (
    <>
      <Route path={route.dashboard} element={<EmployeeDashboard />} />
      <Route path={route.pedp} element={<Pedp />} />
      <Route path={route.projectDetails} element={<Projects />} />
      <Route path={route.certification} element={<Certification />} />
      <Route path={route.help} element={<Help />} />
      <Route path={route.profile} element={<Profile userRole="Employee" />} />
    </>
  )
}

export default EmployeeRoutes
