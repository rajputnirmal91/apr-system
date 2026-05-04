/* eslint-disable react/destructuring-assignment */
import { Route } from 'react-router-dom'

import AccessPermission from '@project/Pages/Admin/AccessPermission/AccessPermission'
import Dashboard from '@project/Pages/Admin/Dashboard/Dashboard'
import EmployeeEligibility from '@project/Pages/Admin/EmployeeEligibility/EmployeeEligibility'
import CustomGoalsAssociationList from '@project/Pages/Admin/GoalsAssociation/CustomGoalsAssociation/CustomGoalsAssociationList'
import GoalsAssociation from '@project/Pages/Admin/GoalsAssociation/GoalsAssociation'
import GlobalGoalsAssociationList from '@project/Pages/Admin/GoalsAssociation/GobalGoalsAssociation/GlobalGoalsAssociationList'
import Appraisal from '@project/Pages/Admin/Master/Appraisal/Appraisal'
import DateTab from '@project/Pages/Admin/Master/Date/DateTab'
import EmailTemplate from '@project/Pages/Admin/Master/EmailTemplate/EmailTemplate'
import MappedGoals from '@project/Pages/Admin/Master/GoalMapping/MappedGoals'
import Goals from '@project/Pages/Admin/Master/Goals/Goals'
import Kra from '@project/Pages/Admin/Master/Kra/Kra'
import MasterData from '@project/Pages/Admin/Master/Master'
import SessionMaster from '@project/Pages/Admin/Master/SessionMaster/SessionMaster'
import Rating from '@project/Pages/Admin/Rating/Rating'
import Profile from '@project/Pages/Common/Profile/Profile'
import ReportDetails from '@project/Pages/General/Reports/ReportDetails/ReportDetails'
import Reports from '@project/Pages/General/Reports/Reports'

// import GoalMaster from '@project/Pages/Admin/Master/GoalMaster'
// import GoalsMapList from '@project/Pages/Admin/Master/GoalMapping/GoalsMapList'

type AdminRoutesProps = {
  root: string
  dashboard: string
  goalsAssociation: string
  master: string
  rating: string
  employeeEligibility: string
  reports: string
  reportDetails: string
  global: string
  custom: string
  profile: string
  goalMapping: string
  goal: string
  kra: string
  appraisal: string
  milestones: string
  goals: string
  goalMaster: string
  listOfGoal: string
  list: string
  emailTemplate: string
  sessionMaster: string
  accessPermission: string
}

function AdminRoutes(route: AdminRoutesProps) {
  return (
    <>
      <Route path={route.dashboard} element={<Dashboard />} />

      <Route path={route.goalsAssociation} element={<GoalsAssociation />}>
        <Route index element={<GlobalGoalsAssociationList />} />

        <Route path={route.global} element={<GlobalGoalsAssociationList />} />
        <Route path={route.custom} element={<CustomGoalsAssociationList />} />
      </Route>
      <Route path={route.goal} element={<Goals />} />
      <Route path={route.goals} element={<MappedGoals />} />
      <Route path={route.master} element={<MasterData />} />
      <Route path={route.kra} element={<Kra />} />
      <Route path={route.appraisal} element={<Appraisal />} />
      <Route path={route.milestones} element={<DateTab />} />
      <Route path={route.rating} element={<Rating />} />
      <Route
        path={route.employeeEligibility}
        element={<EmployeeEligibility />}
      />
      <Route path={route.reports} element={<Reports />} />
      <Route path={route.reportDetails} element={<ReportDetails />} />
      <Route path={route.profile} element={<Profile userRole="Admin" />} />
      <Route path={route.emailTemplate} element={<EmailTemplate />} />
      <Route path={route.sessionMaster} element={<SessionMaster />} />
      <Route path={route.accessPermission} element={<AccessPermission />} />
    </>
  )
}

export default AdminRoutes
