const ACCESS_PERMISSION_ROLE_KEYS = [
  'EMPLOYEE',
  'HR',
  'IRM',
  'SRM',
  'ADMIN',
  'PROJECT_MANAGER',
  'UNIT_HEAD',
  'MANAGEMENT',
  'DIRECTOR_ENGINEER',
] as const

type AccessPermissionRoleKey = (typeof ACCESS_PERMISSION_ROLE_KEYS)[number]
type AccessPermissionPermissions = Record<AccessPermissionRoleKey, boolean>

const ACCESS_PERMISSION_ROLE_OPTIONS: {
  key: AccessPermissionRoleKey
  label: string
}[] = [
  //   { key: 'EMPLOYEE', label: 'Employee' },
  { key: 'HR', label: 'HR' },
  { key: 'IRM', label: 'IRM' },
  { key: 'SRM', label: 'SRM' },
  { key: 'ADMIN', label: 'Admin' },
  { key: 'PROJECT_MANAGER', label: 'Project Manager' },
  { key: 'UNIT_HEAD', label: 'Unit Head' },
  { key: 'MANAGEMENT', label: 'Management' },
  { key: 'DIRECTOR_ENGINEER', label: 'Director Engineer' },
]

const createInitialPermissions = (): AccessPermissionPermissions =>
  ACCESS_PERMISSION_ROLE_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {} as AccessPermissionPermissions
  )

const createPermissionsFromRoles = (
  roles: string[] = []
): AccessPermissionPermissions => {
  const initialPermissions = createInitialPermissions()
  const roleSet = new Set(roles.map((role) => role.trim().toUpperCase()))

  ACCESS_PERMISSION_ROLE_KEYS.forEach((roleKey) => {
    initialPermissions[roleKey] = roleSet.has(roleKey)
  })

  return initialPermissions
}

const createRolesFromPermissions = (
  permissions: AccessPermissionPermissions,
  existingRoles: string[] = []
): string[] => {
  const managedKeys = new Set(ACCESS_PERMISSION_ROLE_KEYS)
  const unmanagedRoles = existingRoles.filter(
    (role) =>
      !managedKeys.has(role.trim().toUpperCase() as AccessPermissionRoleKey)
  )

  const selectedManagedRoles = ACCESS_PERMISSION_ROLE_KEYS.filter(
    (roleKey) => permissions[roleKey]
  )

  return [...new Set([...unmanagedRoles, ...selectedManagedRoles])]
}

export {
  ACCESS_PERMISSION_ROLE_KEYS,
  ACCESS_PERMISSION_ROLE_OPTIONS,
  createInitialPermissions,
  createPermissionsFromRoles,
  createRolesFromPermissions,
}

export type { AccessPermissionPermissions, AccessPermissionRoleKey }
