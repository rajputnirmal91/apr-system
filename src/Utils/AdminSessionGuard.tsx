import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useGetSessionsQuery } from '@project/Store/Api/Common/commonApi'
import { useAppSelector } from  '@project/Store/hooks'
import { selectUserState } from '@project/Store/Feature/UserSlice'

type SessionGuardProps = {
  children: ReactNode
}

export default function SessionGuard({ children }: SessionGuardProps) {
  const user = useAppSelector(selectUserState)
  const location = useLocation()

  const isAdmin = user?.user_role === 'ADMIN'

  const sessionPath = `/admin/sessionMaster`
  const isSessionPage = location.pathname.startsWith(sessionPath)

  const { data, isLoading, isFetching } = useGetSessionsQuery(undefined, {
    skip: isSessionPage,
  })

  // ⏳ wait for API
  if (isLoading || isFetching) return null

  const sessions = data?.appraisal_sessions || []

  if (isAdmin && sessions.length === 0 && !isSessionPage) {
    return <Navigate to={sessionPath} replace />
  }

  return <>{children}</>
}