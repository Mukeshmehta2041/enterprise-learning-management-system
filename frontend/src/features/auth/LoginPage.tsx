import { useNavigate, Link, useLocation, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { useAuth } from '@/shared/context/AuthContext'
import { useTenant } from '@/shared/context/TenantContext'
import { Button, Input, Card, Container } from '@/shared/ui'
import { AuthResponseSchema, type AuthResponse } from '@/shared/types/auth'
import type { AppError } from '@/shared/types/error'
import { GraduationCap } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const { tenant } = useTenant()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation<AuthResponse, AppError, LoginFormValues>({
    mutationFn: async (values: LoginFormValues) => {
      const response = await apiClient.post<AuthResponse>('/auth/token', {
        ...values,
        username: values.email, // backend expects username
        grant_type: 'password'
      })
      return AuthResponseSchema.parse(response.data)
    },
    onSuccess: async (data) => {
      await login(data.access_token)
      // Redirect will be handled by logic or default to root which branches
      const from = (location.state as any)?.from?.pathname || '/'
      navigate(from, { replace: true })
    },
    onError: (error: AppError) => {
      setError('root', { message: error.message || 'Invalid email or password' })
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values)
  }

  return (
    <Container size="sm" className="flex min-h-screen items-center justify-center py-12">
      <div className="w-full space-y-8">
        <div className="text-center">
          {tenant?.branding.logoUrl ? (
            <img src={tenant.branding.logoUrl} alt="" className="mx-auto h-12 w-12" />
          ) : (
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
            {tenant?.branding.institutionName || 'LMS Platform'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account
          </p>
        </div>

        <Card className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {errors.root && (
              <p className="text-sm font-medium text-red-500" role="alert">{errors.root.message}</p>
            )}

            <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/register" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  )
}
