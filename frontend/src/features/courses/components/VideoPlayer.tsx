import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { usePlaybackToken } from '../api/useContent'
import { useUpdateProgress } from '@/features/enrollments/api/useEnrollments'
import { useRecordPlaybackEvent, type PlaybackEventType } from '@/features/analytics/api/useAnalytics'
import { Lock, AlertCircle, Loader2, Settings } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Heading3, Paragraph } from '@/shared/ui/Typography'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

interface VideoPlayerProps {
  contentId: string
  lessonId: string
  courseId: string
  initialPositionSecs?: number
  onComplete?: () => void
  className?: string
}

export function VideoPlayer({
  contentId,
  lessonId,
  courseId,
  initialPositionSecs = 0,
  onComplete,
  className
}: VideoPlayerProps) {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasResumedRef = useRef(false)
  const [lastSavedTime, setLastSavedTime] = useState(0)
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null)
  const [showQualityMenu, setShowQualityMenu] = useState(false)

  const { data: playbackData, isLoading, error, isError } = usePlaybackToken(contentId)
  const updateProgress = useUpdateProgress(courseId)
  const recordEvent = useRecordPlaybackEvent()

  const currentUrl = useMemo(() => {
    if (selectedQuality && playbackData?.renditions) {
      return playbackData.renditions.find((r: any) => r.resolution === selectedQuality)?.url || playbackData.playbackUrl
    }
    return playbackData?.playbackUrl
  }, [selectedQuality, playbackData])

  // Telemetry helper
  const sendEvent = useCallback((eventType: PlaybackEventType, metadata?: Record<string, unknown>) => {
    if (!videoRef.current) return
    recordEvent.mutate({
      contentId,
      lessonId,
      courseId,
      eventType,
      positionSecs: Math.floor(videoRef.current.currentTime),
      totalDurationSecs: Math.floor(videoRef.current.duration || 0),
      metadata: {
        ...metadata,
        quality: selectedQuality || 'Auto'
      }
    })
  }, [contentId, lessonId, courseId, recordEvent, selectedQuality])

  // Handle quality change with seeking back to current position
  const handleQualityChange = (quality: string | null) => {
    if (!videoRef.current) return
    const currentTime = videoRef.current.currentTime
    const isPaused = videoRef.current.paused

    setSelectedQuality(quality)
    setShowQualityMenu(false)

    // Video element will update its src. We need to restore position after it loads.
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime
        if (!isPaused) videoRef.current.play()
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
    videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)

    sendEvent('HEARTBEAT', { action: 'QUALITY_CHANGE', to: quality || 'Auto' })
  }

  // Resume position
  useEffect(() => {
    if (!isLoading && playbackData && videoRef.current && !hasResumedRef.current && initialPositionSecs > 0) {
      videoRef.current.currentTime = initialPositionSecs
      hasResumedRef.current = true
    }
  }, [isLoading, playbackData, initialPositionSecs])

  // Periodic progress saving
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = Math.floor(videoRef.current.currentTime)
        if (currentTime !== lastSavedTime && currentTime % 10 === 0) {
          updateProgress.mutate({
            lessonId,
            positionSecs: currentTime,
          })
          setLastSavedTime(currentTime)
          sendEvent('HEARTBEAT')
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lessonId, lastSavedTime, updateProgress, sendEvent])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      // Only process if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.code === 'Space') {
        e.preventDefault()
        if (videoRef.current.paused) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      } else if (e.code === 'ArrowRight') {
        videoRef.current.currentTime += 10
      } else if (e.code === 'ArrowLeft') {
        videoRef.current.currentTime -= 10
      } else if (e.code === 'KeyF') {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          videoRef.current.parentElement?.requestFullscreen()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isLoading) {
    return (
      <div className={cn("aspect-video w-full bg-slate-900 flex flex-col items-center justify-center rounded-xl border border-slate-800 shadow-inner", className)}>
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <Paragraph className="text-slate-400 font-medium">Authorizing streaming session...</Paragraph>
      </div>
    )
  }

  if (isError) {
    const errorData = error as { response?: { status?: number; data?: { message?: string } } }
    const isAccessDenied = errorData?.response?.status === 403
    const errorMessage = errorData?.response?.data?.message
    const isCourseUnavailable = typeof errorMessage === 'string'
      && errorMessage.toLowerCase().includes('not available')

    return (
      <div className={cn("aspect-video w-full bg-slate-900 flex flex-col items-center justify-center rounded-xl p-8 text-center border border-slate-800 shadow-2xl", className)}>
        {isAccessDenied ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-500/5">
              <Lock size={40} className="text-amber-500" />
            </div>
            <Heading3 className="mb-2 text-white">
              {isCourseUnavailable ? 'Course Unavailable' : 'Access Restricted'}
            </Heading3>
            <Paragraph className="text-slate-400 max-w-md mb-8 leading-relaxed">
              {isCourseUnavailable
                ? 'This course is currently unpublished or archived. Please check back later.'
                : 'This lecture requires an active enrollment. Your access may have been revoked or expired.'}
            </Paragraph>
            <Button size="lg" className="rounded-full px-8" onClick={() => navigate(`/courses/${courseId}`)}>
              Go to Course Page
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-500/5">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <Heading3 className="mb-2 text-white">Playback Error</Heading3>
            <Paragraph className="text-slate-400 mb-8 leading-relaxed">
              We couldn't authorize your playback session. This could be due to an expired session or network issues.
            </Paragraph>
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 rounded-full px-8" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative group aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5", className)}>
      <video
        ref={videoRef}
        key={currentUrl}
        src={currentUrl}
        controls
        playsInline
        className="h-full w-full"
        onPlay={() => sendEvent('PLAY')}
        onPause={() => sendEvent('PAUSE')}
        onSeeking={() => sendEvent('SEEK')}
        onEnded={() => {
          sendEvent('COMPLETE')
          onComplete?.()
        }}
        onError={(e) => sendEvent('ERROR', { error: e.toString() })}
        controlsList="nodownload"
        disablePictureInPicture
      >
        {playbackData?.captions?.map((caption) => (
          <track
            key={caption.languageCode}
            kind="subtitles"
            src={caption.url}
            srcLang={caption.languageCode}
            label={caption.label}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Quality Selection Menu */}
      {playbackData?.renditions && playbackData.renditions.length > 0 && (
        <div className="absolute bottom-12 right-4 z-20">
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Video settings"
          >
            <Settings size={18} className={cn(showQualityMenu && "rotate-45")} />
          </button>

          {showQualityMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
              <div className="p-2 border-b border-white/5 bg-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Quality</span>
              </div>
              <div className="p-1">
                <button
                  onClick={() => handleQualityChange(null)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
                    !selectedQuality ? "bg-primary/20 text-primary font-bold" : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  Auto
                </button>
                {playbackData.renditions.map((rendition) => (
                  <button
                    key={rendition.resolution}
                    onClick={() => handleQualityChange(rendition.resolution)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
                      selectedQuality === rendition.resolution ? "bg-primary/20 text-primary font-bold" : "text-slate-300 hover:bg-white/5"
                    )}
                  >
                    {rendition.resolution}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Identity Badge */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
            Secure HD Stream
          </span>
        </div>
      </div>
    </div>
  )
}
