import { usePlaybackToken } from '../api/useContent'
import { FileText, Download, Fullscreen, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Heading3, Paragraph } from '@/shared/ui/Typography'
import { cn } from '@/shared/utils/cn'

interface DocumentPlayerProps {
  contentId: string
  lessonId: string
  courseId: string
  className?: string
}

export function DocumentPlayer({
  contentId,
  className
}: DocumentPlayerProps) {
  const { data: playbackData, isLoading, isError } = usePlaybackToken(contentId)

  if (isLoading) {
    return (
      <div className={cn("aspect-video w-full bg-slate-900 flex flex-col items-center justify-center rounded-xl border border-slate-800", className)}>
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <Paragraph className="text-slate-400 font-medium">Preparing document...</Paragraph>
      </div>
    )
  }

  if (isError || !playbackData) {
    return (
      <div className={cn("aspect-video w-full bg-slate-900 flex flex-col items-center justify-center rounded-xl p-8 text-center border border-slate-800", className)}>
        <AlertCircle size={40} className="text-red-500 mb-4" />
        <Heading3 className="text-white mb-2">Failed to load document</Heading3>
        <Paragraph className="text-slate-400 mb-6">We couldn't retrieve the document link. Please try again.</Paragraph>
        <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    )
  }

  const isPdf = playbackData.playbackUrl.toLowerCase().includes('.pdf') ||
    playbackData.playbackUrl.toLowerCase().includes('pdf')

  return (
    <div className={cn("flex flex-col gap-4 w-full h-[70vh]", className)}>
      <div className="flex-grow bg-slate-100 rounded-xl overflow-hidden relative shadow-2xl border border-white/5">
        {isPdf ? (
          <iframe
            src={`${playbackData.playbackUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title="Document Viewer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-12">
            <div className="h-24 w-24 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 ring-8 ring-indigo-500/5">
              <FileText size={48} className="text-indigo-400" />
            </div>
            <Heading3 className="mb-4">Document Ready</Heading3>
            <Paragraph className="text-slate-400 text-center max-w-md mb-8">
              This document (e.g., Word, PowerPoint) cannot be previewed directly in the browser.
              Please download it to view the contents.
            </Paragraph>
            <Button size="lg" className="rounded-full px-8 gap-2" onClick={() => window.open(playbackData.playbackUrl)}>
              <Download size={18} />
              Download Document
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between bg-slate-900/50 backdrop-blur-md p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <FileText size={18} className="text-indigo-400" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">Resource File</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure Access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => window.open(playbackData.playbackUrl)}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
          {isPdf && (
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => window.open(playbackData.playbackUrl)}>
              <Fullscreen size={16} className="mr-2" />
              Full View
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
