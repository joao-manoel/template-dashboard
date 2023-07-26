'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { PermissionValidation } from '@/utils/permissionValidation'

type useCanParams = {
  permissions?: string[]
  roles?: string[]
}

export const useCan = ({
  permissions = [],
  roles = [],
}: useCanParams): boolean => {
  const { user, isAuthenticated } = useAuthContext()

  if (!isAuthenticated) {
    return false
  }

  const userHasValidPermissions = PermissionValidation({
    user,
    roles,
    permissions,
  })

  return userHasValidPermissions
}
