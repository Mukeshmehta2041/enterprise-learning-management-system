import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { UserSchema, type User } from '@/shared/types/user'
import { apiClient } from '@/shared/api/client'

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [isLoading, setIsLoading] = useState(true)

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get<User>('/users/me')
      setUser(UserSchema.parse(response.data))
    } catch (error) {
      console.error('Failed to fetch user', error)
      localStorage.removeItem('accessToken')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCurrentUser()
    } else {
      setIsLoading(false)
    }
  }, [token])

  const login = async (newToken: string) => {
    localStorage.setItem('accessToken', newToken)
    setToken(newToken)
    await fetchCurrentUser()
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
