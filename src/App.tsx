import { Suspense } from 'react'

import { Route, Routes } from 'react-router-dom'

import AdminLayout from '@project/Pages/Layout/AdminLayout/AdminLayout'
import EmployeeLayout from '@project/Pages/Layout/EmployeeLayout/EmployeeLayout'
import AdminRoutes from '@project/Routes/AdminRoutes'
import AuthRoutes from '@project/Routes/AuthRoutes'
import EmployeeRoutes from '@project/Routes/EmployeeRoutes'
import ProtectedRoute from '@project/Routes/ProtectedRoute'
import {
  adminRoutes,
  authRoutes,
  employeeRoutes,
  hrRoutes,
  irmRoutes,
  managementRoutes,
  srmRoutes,
  unitHeadRoutes,
} from '@project/Utils/routeNavigation'

import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'
import HrLayout from './Pages/Layout/HrLayout/HrLayout'
import IrmLayout from './Pages/Layout/IrmLayout/IrmLayout'
import ManagementLayout from './Pages/Layout/ManagementLayout/ManagementLayout'
import ManagerLayout from './Pages/Layout/ManagerLayout/ManagerLayout'
import UnitHeadLayout from './Pages/Layout/UnitHeadLayout/UnitHeadLayout'
import HrRoutes from './Routes/HrRoutes'
import IrmRoutes from './Routes/IrmRoutes'
import ManagementRoutes from './Routes/ManagementRoutes'
import SrmRoutes from './Routes/SrmRoutes'
import UnitHeadRoutes from './Routes/UnitHeadRoutes'
import SessionGuard from './Utils/AdminSessionGuard'
import Spinner from './Common/Spinner'
import { useAppSelector } from './Store/hooks'
import type { UnpersistedRootState } from './Store/store'

import './App.scss'

function App() {
  const isLoading = useAppSelector(
    (state) =>
      (state as unknown as UnpersistedRootState).loadingSlice.activeRequests > 0
  )
  return (
    <ErrorBoundary boundaryName="Global">
      <Spinner loading={isLoading} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {AuthRoutes(authRoutes)}

          {/* Admin Role */}
          <Route
            path={adminRoutes.root}
            element={
              <ProtectedRoute>
                <SessionGuard>
                  <AdminLayout />
                </SessionGuard>
              </ProtectedRoute>
            }
          >
            {AdminRoutes(adminRoutes)}
          </Route>

          {/* Employee Role */}
          <Route
            path={employeeRoutes.root}
            element={
              <ProtectedRoute>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            {EmployeeRoutes(employeeRoutes)}
          </Route>

          {/* IRM Role */}
          <Route
            path={irmRoutes.root}
            element={
              <ProtectedRoute>
                <IrmLayout />
              </ProtectedRoute>
            }
          >
            {IrmRoutes(irmRoutes)}
          </Route>

          {/* SRM Role */}
          <Route
            path={srmRoutes.root}
            element={
              <ProtectedRoute>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            {SrmRoutes(srmRoutes)}
          </Route>

          {/* Unit Head Role */}
          <Route
            path={unitHeadRoutes.root}
            element={
              <ProtectedRoute>
                <UnitHeadLayout />
              </ProtectedRoute>
            }
          >
            {UnitHeadRoutes(unitHeadRoutes)}
          </Route>

          <Route
            path={managementRoutes.root}
            element={
              <ProtectedRoute>
                <ManagementLayout />
              </ProtectedRoute>
            }
          >
            {ManagementRoutes(managementRoutes)}
          </Route>
          <Route
            path={hrRoutes.root}
            element={
              <ProtectedRoute>
                <HrLayout />
              </ProtectedRoute>
            }
          >
            {HrRoutes(hrRoutes)}
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
