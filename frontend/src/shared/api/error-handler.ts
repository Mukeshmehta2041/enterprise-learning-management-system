import axios from 'axios'
import { AppError } from '../types/error'

export const handleApiError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    // Check if backend returned a standard error response
    if (data && typeof data === 'object') {
      return {
        message: data.message || error.message,
        code: data.code,
        status: error.response?.status,
        fieldErrors: data.fieldErrors,
      }
    }

    return {
      message: error.message,
      status: error.response?.status,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'An unexpected error occurred',
  }
}
