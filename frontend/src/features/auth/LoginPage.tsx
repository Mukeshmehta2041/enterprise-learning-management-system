import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { useAuth } from '@/shared/context/AuthContext'
import { Button, Input, Card, Container } from '@/shared/ui'
import { AuthResponseSchema, type AuthResponse } from '@/shared/types/auth'
import type { AppError } from '@/shared/types/error'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

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
      navigate('/dashboard')
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
      <Card className="w-full" title="Sign in to LMS" description="Enter your credentials to access your courses">
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
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </div>
      </Card>
    </Container>
  )
}
