import { type ReactNode } from 'react'
import { useAccess, type Role, type Action, type Resource } from '@/shared/hooks/useAccess'

interface CanProps {
  role?: Role | Role[]
  action?: Action
  resource?: Resource
  children: ReactNode
  fallback?: ReactNode
}

/**
 * A declarative component for permission checks.
 * Usage:
 * <Can role="ADMIN">
 *   <button>Secret Admin Action</button>
 * </Can>
 */
export function Can({ role, action, resource, children, fallback = null }: CanProps) {
  const { hasRole, can } = useAccess()

  let allowed = false

  if (role) {
    allowed = hasRole(role)
  } else if (action && resource) {
    allowed = can(action, resource)
  }

  if (allowed) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
