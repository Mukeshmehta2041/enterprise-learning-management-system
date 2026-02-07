import { Card, Button, Heading2, Heading3, Heading4, TextMuted, Muted } from '@/shared/ui'
import { CheckCircle, Tag } from 'lucide-react'

interface CourseReviewProps {
  data: any
  onBack: () => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function CourseReview({ data, onBack, onSubmit, isSubmitting }: CourseReviewProps) {
  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-start justify-between gap-8 mb-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mb-2">
              <Tag size={16} />
              <span>{data.category} • {data.level}</span>
            </div>
            <Heading2 className="break-words">{data.title}</Heading2>
            <Muted className="text-xl mt-2 break-words whitespace-pre-wrap">{data.description}</Muted>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold">${Number(data.price).toFixed(2)}</div>
            <TextMuted>Target Price</TextMuted>
          </div>
        </div>

        <section className="space-y-6">
          <Heading3 className="border-b pb-2">Curriculum Overview</Heading3>
          <div className="space-y-4">
            {data.modules.map((module: any, idx: number) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4">
                <Heading4 className="mb-2 break-words">Module {idx + 1}: {module.title}</Heading4>
                <ul className="ml-4 space-y-1">
                  {module.lessons.map((lesson: any, lIdx: number) => (
                    <li key={lIdx} className="text-slate-600 flex items-center gap-2 text-sm italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span className="break-words">{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Card>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex gap-4">
        <CheckCircle className="text-indigo-600 h-6 w-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-indigo-900">Ready to Publish?</h4>
          <p className="text-indigo-700 text-sm mt-1">
            By clicking publish, your course will be submitted for review. Once approved, it will be visible in the public course catalog.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back to Curriculum
        </Button>
        <Button
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting}
          className="px-12 bg-indigo-600 hover:bg-indigo-700"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Course'}
        </Button>
      </div>
    </div>
  )
}
