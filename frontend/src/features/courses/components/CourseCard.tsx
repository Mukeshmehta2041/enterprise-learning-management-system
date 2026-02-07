import { Link } from 'react-router-dom'
import type { Course } from '@/shared/types/course'
import { Card } from '@/shared/ui/Layout'
import { Heading3, TextMuted, TextSmall } from '@/shared/ui/Typography'
import { BookOpen, Users, Star, Clock } from 'lucide-react'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="block transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card className="h-full overflow-hidden flex flex-col">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
            <BookOpen size={48} />
          </div>
        )}

        <div className="p-4 flex-grow flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {course.category}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
              {course.level}
            </span>
          </div>

          <Heading3 className="mb-2 line-clamp-2">{course.title}</Heading3>
          <TextMuted className="text-sm line-clamp-2 mb-4 flex-grow">
            {course.description}
          </TextMuted>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users size={14} className="text-slate-400" />
                <TextSmall>{course.totalEnrollments ?? 0}</TextSmall>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <TextSmall>{(course.rating ?? 0).toFixed(1)}</TextSmall>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-slate-400" />
                <TextSmall>{course.duration || '0h'}</TextSmall>
              </div>
            </div>

            <div className="font-bold text-primary">
              ${(course.price ?? 0).toFixed(2)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
