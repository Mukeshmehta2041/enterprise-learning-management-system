export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  thumbnailUrl?: string
  category: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  price: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  totalEnrollments: number
  rating: number
  duration: string // e.g. "10h 30m"
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  title: string
  description?: string
  contentUrl?: string
  contentType: 'VIDEO' | 'DOCUMENT' | 'QUIZ'
  duration?: string
  order: number
}

export interface Module {
  id: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export interface CourseDetail extends Course {
  modules: Module[]
}

export interface CourseFilters {
  page?: number
  size?: number
  category?: string
  level?: string
  status?: string
  search?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}
