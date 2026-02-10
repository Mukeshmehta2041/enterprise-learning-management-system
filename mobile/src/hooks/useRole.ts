import { useAuthStore } from '../state/useAuthStore'

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'

export function useRole() {
  const user = useAuthStore((state) => state.user)
  const role = user?.role as UserRole | undefined

  const isStudent = role === 'STUDENT'
  const isInstructor = role === 'INSTRUCTOR'
  const isAdmin = role === 'ADMIN'

  const hasRole = (roles: UserRole[]) => {
    return role ? roles.includes(role) : false
  }

  return {
    role,
    isStudent,
    isInstructor,
    isAdmin,
    hasRole,
  }
}
