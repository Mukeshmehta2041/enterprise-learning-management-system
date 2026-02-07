import axios from 'axios'
import { handleApiError } from './error-handler'
import { toast } from '../context/ToastContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL + "/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// Interceptor to handle errors (e.g. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = handleApiError(error)

    if (error.response?.status === 401) {
      // Handle unauthorized (logout, redirect, etc.)
      localStorage.removeItem('accessToken')
      // Optional: window.location.href = '/login'
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('A server error occurred. Our team has been notified.')
    } else if (!error.response && error.message === 'Network Error') {
      toast.error('Network error. Please check your internet connection.')
    }

    return Promise.reject(appError)
  }
)
