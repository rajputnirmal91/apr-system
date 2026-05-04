/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import IrmDashboard from '@project/Pages/Irm/IrmDashboard/IrmDashboard'
import IrmCertificationsTab from '@project/Pages/Irm/IrmDetailsTab/IrmCertificationsTab/IrmCertificationsTab'
import IrmDetailsTab from '@project/Pages/Irm/IrmDetailsTab/IrmDetailsTab'
import IrmHelp from '@project/Pages/Irm/IrmDetailsTab/IrmHelp/IrmHelp'
import IrmPedpTab from '@project/Pages/Irm/IrmDetailsTab/IrmPedpTab/IrmPedpTab'
import IrmProjectsTab from '@project/Pages/Irm/IrmDetailsTab/IrmProjectsTab/IrmProjectsTab'

type IrmRouteProps = {
  root: string
  dashboard: string
  irmDetailsTab: string
  irmPedpTab: string
  irmProjectsTab: string
  IrmCertificationsTab: string
  irmHelp: string
}

function IrmRoutes(route: IrmRouteProps) {
  return (
    <>
      <Route path={route.dashboard} element={<IrmDashboard />} />
      <Route path={route.irmDetailsTab} element={<IrmDetailsTab />} />
      <Route
        path={`${route.irmDetailsTab}/:employee_user_id`}
        element={<IrmDetailsTab />}
      />
      <Route path={route.irmPedpTab} element={<IrmPedpTab />} />
      <Route path={route.irmProjectsTab} element={<IrmProjectsTab />} />
      <Route
        path={route.IrmCertificationsTab}
        element={<IrmCertificationsTab />}
      />
      <Route path={route.irmHelp} element={<IrmHelp />} />
    </>
  )
}

export default IrmRoutes
