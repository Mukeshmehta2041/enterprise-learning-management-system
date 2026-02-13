export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnailUrl?: string
  instructorId?: string
  instructorIds?: string[]
  instructorName?: string
  price: number
  currency?: string
  isFree?: boolean
  hasAccess?: boolean
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  averageRating?: number
  rating?: number
  enrollmentCount?: number
  isFeatured?: boolean
  isTrending?: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
  modules?: Module[]
}

export interface Module {
  id: string
  title: string
  orderIndex: number
  sortOrder?: number
  description?: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  duration?: number
  durationMinutes?: number
  orderIndex: number
  sortOrder?: number
  type: 'VIDEO' | 'DOCUMENT' | 'QUIZ'
  isPreview?: boolean
  canWatch?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  availableAt?: string | null
}
