import { AxiosError } from 'axios'
import { ApiError } from '../types/api'

export class MobileAppError extends Error {
  code: string
  status?: number
  isRetryable: boolean
  fieldErrors?: Record<string, string>

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    status?: number,
    isRetryable: boolean = false,
    fieldErrors?: Record<string, string>,
  ) {
    super(message)
    this.name = 'MobileAppError'
    this.code = code
    this.status = status
    this.isRetryable = isRetryable
    this.fieldErrors = fieldErrors
  }
}

export function mapErrorToMobileError(error: unknown): MobileAppError {
  if (error instanceof MobileAppError) {
    return error
  }

  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined
    const status = error.response?.status

    if (!error.response) {
      // Network error
      return new MobileAppError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        undefined,
        true,
      )
    }

    if (status === 401) {
      return new MobileAppError('Session expired. Please log in again.', 'UNAUTHORIZED', 401, false)
    }

    if (status === 403) {
      return new MobileAppError(
        'You do not have permission to perform this action.',
        'FORBIDDEN',
        403,
        false,
      )
    }

    if (status === 422 || (status === 400 && apiError?.errors)) {
      return new MobileAppError(
        apiError?.message || 'Validation failed',
        'VALIDATION_ERROR',
        status,
        false,
        apiError?.errors,
      )
    }

    return new MobileAppError(
      apiError?.message || 'Something went wrong',
      apiError?.code || 'SERVER_ERROR',
      status,
      status ? status >= 500 : false,
    )
  }

  return new MobileAppError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    'UNKNOWN_ERROR',
  )
}
