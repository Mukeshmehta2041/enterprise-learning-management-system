import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { useAuth } from '@/shared/context/AuthContext'
import { useTenant } from '@/shared/context/TenantContext'
import { Button, Input, Card, Container } from '@/shared/ui'
import type { AppError } from '@/shared/types/error'
import { GraduationCap } from 'lucide-react'

const registerSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { tenant } = useTenant()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = useMutation<void, AppError, RegisterFormValues>({
    mutationFn: async (values: RegisterFormValues) => {
      await apiClient.post('/users', values)
    },
    onSuccess: () => {
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } })
    },
    onError: (error: AppError) => {
      setError('root', { message: error.message || 'Registration failed. Try again.' })
    },
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values)
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
            Join {tenant?.branding.institutionName || 'LMS Platform'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create an account to start learning
          </p>
        </div>

        <Card className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
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

            <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  )
}
