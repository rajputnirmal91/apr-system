import commonApi from '@project/Store/Api/Common/commonApi'
import { AppDispatch } from '@project/Store/store'
import {
  adminRoutes,
  employeeRoutes,
  hrRoutes,
  irmRoutes,
  managementRoutes,
  srmRoutes,
  unitHeadRoutes,
} from '@project/Utils/routeNavigation'

/**
 * Returns the default dashboard path for a given user role.
 * Used for already-authenticated redirects and non-ADMIN roles after login.
 */
export function getRoleDashboardPath(role: string): string | null {
  const map: Record<string, string> = {
    ADMIN: `/${adminRoutes.root}/${adminRoutes.dashboard}`,
    USER: `/${employeeRoutes.root}/${employeeRoutes.dashboard}`,
    SRM: `/${srmRoutes.root}/${srmRoutes.dashboard}`,
    IRM: `/${irmRoutes.root}/${irmRoutes.dashboard}`,
    HR: `/${hrRoutes.root}/${hrRoutes.dashboard}`,
    UNIT_HEAD: `/${unitHeadRoutes.root}/${unitHeadRoutes.dashboard}`,
    MANAGEMENT: `/${managementRoutes.root}/${managementRoutes.dashboard}`,
  }
  return map[role] ?? null
}

/**
 * Determines the correct post-login path for ADMIN.
 * Redirects to Session Master if no sessions exist, otherwise to Dashboard.
 */
export async function getAdminPostLoginPath(
  dispatch: AppDispatch
): Promise<string> {
  try {
    const result = await dispatch(
      commonApi.endpoints.getSessions.initiate()
    ).unwrap()

    return result?.appraisal_sessions?.length === 0
      ? `/${adminRoutes.root}/${adminRoutes.sessionMaster}`
      : `/${adminRoutes.root}/${adminRoutes.dashboard}`
  } catch {
    return `/${adminRoutes.root}/${adminRoutes.dashboard}`
  }
}
