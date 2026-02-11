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
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  averageRating?: number
  rating?: number
  enrollmentCount?: number
  tags?: string[]
  createdAt: string
  updatedAt: string
  modules?: Module[]
}

export interface Module {
  id: string
  title: string
  orderIndex: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  duration?: number
  orderIndex: number
  type: 'VIDEO' | 'ARTICLE' | 'QUIZ'
}
