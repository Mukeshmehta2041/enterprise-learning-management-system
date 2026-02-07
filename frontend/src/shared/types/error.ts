export interface FieldError {
  field: string
  message: string
}

export interface AppError {
  message: string
  code?: string
  status?: number
  fieldErrors?: FieldError[]
}

/**
 * Standard backend response shape for pagination
 */
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  nextCursor?: string | null
}
