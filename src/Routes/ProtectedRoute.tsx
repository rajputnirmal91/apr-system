import { ReactNode } from 'react'

import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { selectUserState } from '@project/Store/Feature/UserSlice'
import { authRoutes } from '@project/Utils/routeNavigation'

type ProtectedRouteProps = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useSelector(selectUserState)
  const location = useLocation()

  const isAuthenticated = Boolean(user?.accessToken)

  if (!isAuthenticated) {
    return <Navigate to={authRoutes.root} state={{ from: location }} replace />
  }

  // derive expected role from first URL segment and compare with user role
  const pathSegment = location.pathname.split('/')[1]
  const roleMap: Record<string, string> = {
    admin: 'ADMIN',
    user: 'USER',
    irm: 'IRM',
    hr: 'HR',
    'unit-head': 'UNIT_HEAD',
    SRM: 'SRM',
    management: 'MANAGEMENT',
  }

  const expectedRole = roleMap[pathSegment]
  if (expectedRole && user.user_role && expectedRole !== user.user_role) {
    // mismatch – clear session so route guard will redirect to login
    // this also prevents user from copying a different-role URL
    return <Navigate to={authRoutes.root} state={{ from: location }} replace />
  }

  return <div>{children}</div>
}
