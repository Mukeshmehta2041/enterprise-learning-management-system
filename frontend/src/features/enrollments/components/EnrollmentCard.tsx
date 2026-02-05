import { Link } from 'react-router-dom'
import type { Enrollment } from '@/shared/types/enrollment'
import { Card } from '@/shared/ui/Layout'
import { Heading3, Small } from '@/shared/ui/Typography'
import { PlayCircle, Clock } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface EnrollmentCardProps {
  enrollment: Enrollment
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-40">
        {enrollment.courseThumbnailUrl ? (
          <img
            src={enrollment.courseThumbnailUrl}
            alt={enrollment.courseTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            <PlayCircle size={48} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${enrollment.progress}%` }}
          />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${enrollment.status === 'COMPLETED'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-blue-100 text-blue-700'
            }`}>
            {enrollment.status}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {enrollment.progress}% Complete
          </span>
        </div>

        <Heading3 className="text-lg mb-4 line-clamp-2 flex-grow">
          {enrollment.courseTitle}
        </Heading3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={14} />
            <Small>Last accessed: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}</Small>
          </div>

          <Link to={`/courses/${enrollment.courseId}`}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
              {enrollment.status === 'COMPLETED' ? 'Review' : 'Continue'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
