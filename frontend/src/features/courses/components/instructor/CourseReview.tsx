import { Card, Button, Heading2, Heading3, Heading4, TextMuted, Muted } from '@/shared/ui'
import { CheckCircle, Tag } from 'lucide-react'

interface CourseReviewProps {
  data: any
  onBack: () => void
  onSubmit: () => void
}

export function CourseReview({ data, onBack, onSubmit }: CourseReviewProps) {
  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mb-2">
              <Tag size={16} />
              <span>{data.category} • {data.level}</span>
            </div>
            <Heading2>{data.title}</Heading2>
            <Muted className="text-xl mt-2">{data.description}</Muted>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${Number(data.price).toFixed(2)}</div>
            <TextMuted>Target Price</TextMuted>
          </div>
        </div>

        <section className="space-y-6">
          <Heading3 className="border-b pb-2">Curriculum Overview</Heading3>
          <div className="space-y-4">
            {data.modules.map((module: any, idx: number) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4">
                <Heading4 className="mb-2">Module {idx + 1}: {module.title}</Heading4>
                <ul className="ml-4 space-y-1">
                  {module.lessons.map((lesson: any, lIdx: number) => (
                    <li key={lIdx} className="text-slate-600 flex items-center gap-2 text-sm italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {lesson.title}
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
        <Button variant="outline" onClick={onBack}>
          Back to Curriculum
        </Button>
        <Button onClick={onSubmit} size="lg" className="px-12 bg-indigo-600 hover:bg-indigo-700">
          Publish Course
        </Button>
      </div>
    </div>
  )
}
