import { Card } from '@/shared/ui/Layout'

export function CourseSkeleton() {
  return (
    <Card className="h-full overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-slate-200" />
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-full bg-slate-200 rounded mb-1" />
        <div className="h-4 w-5/6 bg-slate-200 rounded mb-4" />
        <div className="pt-4 border-t border-slate-100 flex justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
      </div>
    </Card>
  )
}
