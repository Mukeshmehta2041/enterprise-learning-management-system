export interface PageResponse<T> {
  items?: T[]
  content?: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  nextCursor?: string | null
}

export interface ApiError {
  status: number
  code: string
  message: string
  timestamp: string
  errors?: Record<string, string>
}
