type userProps = {
  roles: {
    name: string
    permissions: {
      name: string
    }[]
  }[]
}

type permissionValidationProps = {
  user: userProps | undefined
  roles?: string[]
  permissions?: string[]
}

export function PermissionValidation({
  user,
  roles,
  permissions,
}: permissionValidationProps): boolean {
  if (user) {
    // verifica se tem a role
    if (roles && roles.length > 0) {
      const hasRole = user.roles.filter((role) => roles.includes(role.name))

      if (hasRole.length >= 1) {
        return true
      }
    }

    // verifica se tem permissao
    if (permissions && permissions.length > 0) {
      const userPermissions = user.roles
        .flatMap((role) => role.permissions)
        .map((permission) => permission.name)
      const hasPermissions = permissions.every((permission) =>
        userPermissions.includes(permission),
      )

      if (hasPermissions) {
        return true
      }
    }
  }

  return false
}
