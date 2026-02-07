import { useAuth } from '@/shared/context/AuthContext'
import { useMemo } from 'react'

export type Role = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN'

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage'
export type Resource = 'course' | 'assignment' | 'enrollment' | 'user' | 'analytics' | 'settings'

export function useAccess() {
  const { user, isAuthenticated } = useAuth()

  const hasRole = (roles: Role | Role[]) => {
    if (!user || !isAuthenticated) return false
    const requiredRoles = Array.isArray(roles) ? roles : [roles]
    return requiredRoles.some((role) => user.roles.includes(role))
  }

  const isLearner = useMemo(() => hasRole('LEARNER'), [user, isAuthenticated])
  const isInstructor = useMemo(() => hasRole('INSTRUCTOR'), [user, isAuthenticated])
  const isAdmin = useMemo(() => hasRole('ADMIN'), [user, isAuthenticated])

  /**
   * Simple policy-based check. 
   * In a real app, this might come from the backend or a library like CASL.
   */
  const can = (action: Action, resource: Resource) => {
    if (!user || !isAuthenticated) return false

    // Admins can do everything
    if (user.roles.includes('ADMIN')) return true

    // Instructors
    if (user.roles.includes('INSTRUCTOR')) {
      if (resource === 'course') return true // Can manage their own eventually, but for now global
      if (resource === 'assignment') return true
      if (resource === 'analytics') return true
    }

    // Learners
    if (user.roles.includes('LEARNER')) {
      if (action === 'read') return true
      if (resource === 'enrollment') return true
    }

    return false
  }

  return {
    hasRole,
    can,
    isLearner,
    isInstructor,
    isAdmin,
    roles: user?.roles || [],
  }
}
