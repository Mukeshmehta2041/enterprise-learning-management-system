import { useForm, useFieldArray, Controller, type Control, type UseFormRegister } from 'react-hook-form'
import { Card, Button, Input, IconButton, Select, TextMuted, Switch } from '@/shared/ui'
import { Plus, Trash2, GripVertical, Upload, CheckCircle2, FileVideo, FileText, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ModuleInput, LessonInput } from '@/shared/types/course'
import { useLessonContent, useUploadContent, useCreateAndUploadContent } from '../../api/useContent'
import { getMediaErrorMessage } from '@/shared/api/media-errors'
import { logClientError } from '@/shared/utils/client-telemetry'
import { useState } from 'react'

interface CurriculumFormProps {
  courseId?: string
  initialModules?: ModuleInput[]
  initialData?: { modules?: ModuleInput[] } // For compatibility with wizard
  onSave?: (modules: ModuleInput[]) => void
  onNext?: (data: { modules: ModuleInput[] }) => void // For compatibility with wizard
  onBack?: () => void
}

export function CurriculumForm({
  courseId,
  initialModules,
  initialData,
  onSave,
  onNext,
  onBack,
}: CurriculumFormProps) {
  const modules = initialModules || initialData?.modules || []

  const { register, control, handleSubmit } = useForm<{ modules: ModuleInput[] }>({
    defaultValues: {
      modules:
        modules.length > 0
          ? modules
          : [{ title: 'Introduction', lessons: [{ title: 'Welcome', type: 'VIDEO' }] }],
    },
  })

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
    move: moveModule,
  } = useFieldArray({
    control,
    name: 'modules',
    keyName: 'fieldId',
  })

  const onSubmit = (data: { modules: ModuleInput[] }) => {
    if (onSave) onSave(data.modules)
    if (onNext) onNext(data)
  }

  const moduleSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = moduleFields.findIndex((module) => module.fieldId === active.id)
    const newIndex = moduleFields.findIndex((module) => module.fieldId === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      moveModule(oldIndex, newIndex)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <DndContext
          sensors={moduleSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleModuleDragEnd}
        >
          <div className="space-y-6 mb-6">
            <SortableContext
              items={moduleFields.map((module) => module.fieldId)}
              strategy={verticalListSortingStrategy}
            >
              {moduleFields.map((module, moduleIndex) => (
                <SortableModuleCard key={module.fieldId} id={module.fieldId}>
                  {({ listeners }) => (
                    <Card className="p-6">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            type="button"
                            className="cursor-grab text-slate-300 hover:text-slate-500 transition-colors shrink-0 p-1"
                            aria-label="Drag module"
                            {...listeners}
                          >
                            <GripVertical size={22} />
                          </button>
                          <div className="flex-1">
                            <Input
                              placeholder={`Module ${moduleIndex + 1} Title`}
                              className="font-bold text-xl h-12 bg-transparent border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-300 transition-all px-4"
                              {...register(`modules.${moduleIndex}.title` as const, { required: true })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                          <IconButton
                            icon={<ArrowUp size={18} />}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-indigo-600 w-9 h-9"
                            onClick={() => moduleIndex > 0 && moveModule(moduleIndex, moduleIndex - 1)}
                            aria-label="Move module up"
                            disabled={moduleIndex === 0}
                          />
                          <IconButton
                            icon={<ArrowDown size={18} />}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-indigo-600 w-9 h-9"
                            onClick={() => moduleIndex < moduleFields.length - 1 && moveModule(moduleIndex, moduleIndex + 1)}
                            aria-label="Move module down"
                            disabled={moduleIndex === moduleFields.length - 1}
                          />
                          <div className="w-px h-6 bg-slate-200 mx-1" />
                          <IconButton
                            icon={<Trash2 size={18} />}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-rose-600 w-9 h-9"
                            onClick={() => {
                              if (window.confirm('Delete this module and its lessons?')) {
                                removeModule(moduleIndex)
                              }
                            }}
                            aria-label="Delete module"
                          />
                        </div>
                      </div>

                      <LessonsList
                        moduleIndex={moduleIndex}
                        control={control}
                        register={register}
                        courseId={courseId}
                      />
                    </Card>
                  )}
                </SortableModuleCard>
              ))}
            </SortableContext>
          </div>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => appendModule({ title: '', lessons: [] })}
        >
          <Plus size={20} className="mr-2" />
          Add New Module
        </Button>

        <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
          {onBack && (
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
          )}
          <Button type="submit" className={!onBack ? 'ml-auto' : ''}>
            {onNext ? 'Review Course' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function LessonsList({
  moduleIndex,
  control,
  register,
  courseId
}: {
  moduleIndex: number,
  control: Control<{ modules: ModuleInput[] }>,
  register: UseFormRegister<{ modules: ModuleInput[] }>,
  courseId?: string
}) {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
    move: moveLesson,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons` as const,
    keyName: 'fieldId',
  })

  const lessonSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = lessonFields.findIndex((lesson) => lesson.fieldId === active.id)
    const newIndex = lessonFields.findIndex((lesson) => lesson.fieldId === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      moveLesson(oldIndex, newIndex)
    }
  }

  return (
    <div className="ml-8 space-y-3 mt-4">
      <DndContext
        sensors={lessonSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleLessonDragEnd}
      >
        <SortableContext
          items={lessonFields.map((lesson) => lesson.fieldId)}
          strategy={verticalListSortingStrategy}
        >
          {lessonFields.map((lesson, lessonIndex) => (
            <SortableLessonRow key={lesson.fieldId} id={lesson.fieldId}>
              {({ listeners }) => (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg group border border-transparent hover:border-slate-200 transition-colors">
                    <button
                      type="button"
                      className="cursor-grab text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                      aria-label="Drag lesson"
                      {...listeners}
                    >
                      <GripVertical size={18} />
                    </button>
                    <div className="w-24 shrink-0">
                      <Select
                        {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.type` as const)}
                        className="h-8 text-[11px] px-2"
                        options={[
                          { label: 'Video', value: 'VIDEO' },
                          { label: 'Document', value: 'DOCUMENT' },
                          { label: 'Quiz', value: 'QUIZ' },
                        ]}
                        aria-label="Content type"
                      />
                    </div>
                    <Input
                      placeholder={`Lesson ${lessonIndex + 1} Title`}
                      className="bg-transparent border-transparent focus:bg-white flex-1 h-8 text-sm"
                      {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.title` as const, { required: true })}
                    />
                    <div className="w-16 shrink-0 text-center">
                      <Input
                        type="number"
                        min={0}
                        className="h-8 text-[11px] px-1 text-center"
                        placeholder="Mins"
                        {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.durationMinutes` as const, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="w-24 shrink-0">
                      <Select
                        {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.status` as const)}
                        className="h-8 text-[11px] px-2"
                        options={[
                          { label: 'Published', value: 'PUBLISHED' },
                          { label: 'Draft', value: 'DRAFT' },
                          { label: 'Archived', value: 'ARCHIVED' },
                        ]}
                        aria-label="Lesson status"
                      />
                    </div>
                    <Controller
                      control={control}
                      name={`modules.${moduleIndex}.lessons.${lessonIndex}.isPreview` as const}
                      render={({ field }) => (
                        <div className="flex items-center justify-center gap-1 shrink-0 px-2 border-l border-slate-200 min-w-20">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Preview</span>
                          <Switch className="scale-[0.65]" checked={!!field.value} onCheckedChange={field.onChange} />
                        </div>
                      )}
                    />

                    <div className="shrink-0 min-w-25 border-l border-slate-200 pl-2">
                      {lesson.id ? (
                        <LessonMediaUpload
                          lesson={lesson}
                          courseId={courseId}
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Save to upload</span>
                      )}
                    </div>

                    <div className="flex items-center gap-0 border-l border-slate-200 pl-1 shrink-0">
                      <IconButton
                        icon={<ArrowUp size={14} />}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-indigo-600 h-8 w-8 disabled:opacity-10"
                        onClick={() => lessonIndex > 0 && moveLesson(lessonIndex, lessonIndex - 1)}
                        aria-label="Move lesson up"
                        disabled={lessonIndex === 0}
                      />
                      <IconButton
                        icon={<ArrowDown size={14} />}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-indigo-600 h-8 w-8 disabled:opacity-10"
                        onClick={() => lessonIndex < lessonFields.length - 1 && moveLesson(lessonIndex, lessonIndex + 1)}
                        aria-label="Move lesson down"
                        disabled={lessonIndex === lessonFields.length - 1}
                      />
                      <IconButton
                        icon={<Trash2 size={14} />}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-rose-600 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (window.confirm('Delete this lesson?')) {
                            removeLesson(lessonIndex)
                          }
                        }}
                        aria-label="Remove lesson"
                      />
                    </div>
                  </div>
                </div>
              )}
            </SortableLessonRow>
          ))}
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 flex items-center gap-1.5 ml-3"
        onClick={() => appendLesson({ title: '', type: 'VIDEO' })}
      >
        <Plus size={16} strokeWidth={2.5} />
        Add Lesson
      </Button>
    </div>
  )
}

function SortableModuleCard({
  id,
  children,
}: {
  id: string
  children: (args: { listeners: Record<string, unknown> }) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners: (listeners ?? {}) as Record<string, unknown> })}
    </div>
  )
}

function SortableLessonRow({
  id,
  children,
}: {
  id: string
  children: (args: { listeners: Record<string, unknown> }) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners: (listeners ?? {}) as Record<string, unknown> })}
    </div>
  )
}

function LessonMediaUpload({ lesson, courseId }: { lesson: LessonInput, courseId?: string }) {
  const [progress, setProgress] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [canRetry, setCanRetry] = useState(false)
  const [lastFile, setLastFile] = useState<File | null>(null)
  const upload = useUploadContent()
  const createAndUpload = useCreateAndUploadContent()
  const { data: contentItems, isLoading, isError, refetch } = useLessonContent(lesson.id)
  const content = contentItems?.[0]
  const status = content?.status
  const metadata = content?.metadata

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !lesson.id || !courseId) return

    try {
      setErrorMessage(null)
      setCanRetry(false)
      setLastFile(file)
      setProgress(0)

      if (content?.id) {
        await upload.mutateAsync({
          contentId: content.id,
          file,
          onProgress: (p) => setProgress(p)
        })
      } else {
        await createAndUpload.mutateAsync({
          courseId,
          lessonId: lesson.id,
          title: lesson.title || 'Lesson Content',
          type: (lesson.type === 'VIDEO' ? 'VIDEO' : 'PDF') as 'VIDEO' | 'PDF',
          file,
          onProgress: (p) => setProgress(p)
        })
      }
      refetch()
    } catch (error) {
      const { message, retryable } = getMediaErrorMessage(error)
      setErrorMessage(message)
      setCanRetry(retryable)
      logClientError({ feature: 'course-media', action: 'upload', metadata: { lessonId: lesson.id } }, error)
    } finally {
      setProgress(null)
    }
  }

  const handleRetry = async () => {
    if (!lastFile || !lesson.id || !courseId) return
    try {
      setErrorMessage(null)
      setCanRetry(false)
      setProgress(0)

      if (content?.id) {
        await upload.mutateAsync({
          contentId: content.id,
          file: lastFile,
          onProgress: (p) => setProgress(p)
        })
      } else {
        await createAndUpload.mutateAsync({
          courseId,
          lessonId: lesson.id,
          title: lesson.title || 'Lesson Content',
          type: (lesson.type === 'VIDEO' ? 'VIDEO' : 'PDF') as 'VIDEO' | 'PDF',
          file: lastFile,
          onProgress: (p) => setProgress(p)
        })
      }
      refetch()
    } catch (error) {
      const { message, retryable } = getMediaErrorMessage(error)
      setErrorMessage(message)
      setCanRetry(retryable)
      logClientError({ feature: 'course-media', action: 'upload-retry', metadata: { lessonId: lesson.id } }, error)
    } finally {
      setProgress(null)
    }
  }

  if (lesson.type === 'QUIZ') return null

  const hasContent = !!lesson.contentUrl || status === 'READY'

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} isLoading={isLoading} isError={isError} />
      {status === 'FAILED' && (
        <TextMuted className="text-xs text-rose-600">Failed - reupload</TextMuted>
      )}
      {metadata?.durationSecs && (
        <TextMuted className="text-xs">
          {formatDuration(metadata.durationSecs)}
        </TextMuted>
      )}
      {metadata?.sizeBytes && (
        <TextMuted className="text-xs">
          {formatBytes(metadata.sizeBytes)}
        </TextMuted>
      )}
      {errorMessage ? (
        <div className="flex items-center gap-2 text-xs text-rose-600">
          <span>{errorMessage}</span>
          {canRetry && (
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-500"
              onClick={handleRetry}
            >
              Retry
            </button>
          )}
        </div>
      ) : progress !== null ? (
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
          <Loader2 size={14} className="animate-spin" />
          {progress}%
        </div>
      ) : hasContent ? (
        <div className="flex items-center gap-1 text-emerald-600">
          {lesson.type === 'VIDEO' ? <FileVideo size={16} /> : <FileText size={16} />}
          <CheckCircle2 size={14} />
        </div>
      ) : (
        <label className="cursor-pointer p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-indigo-600 transition-colors">
          <Upload size={16} />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={lesson.type === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx,.ppt,.pptx'}
          />
        </label>
      )}
    </div>
  )
}

function StatusBadge({ status, isLoading, isError }: { status?: string; isLoading?: boolean; isError?: boolean }) {
  if (isLoading) {
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
        Checking
      </span>
    )
  }

  if (isError) {
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-500">
        Error loading
      </span>
    )
  }

  if (!status) {
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
        No media
      </span>
    )
  }

  const tone = {
    READY: 'bg-emerald-100 text-emerald-700',
    PROCESSING: 'bg-amber-100 text-amber-700',
    UPLOADING: 'bg-indigo-100 text-indigo-700',
    FAILED: 'bg-rose-100 text-rose-700',
    DRAFT: 'bg-slate-100 text-slate-600',
  } as Record<string, string>

  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full ${tone[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (!remaining) return `${minutes}m`
  return `${minutes}m ${remaining}s`
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  const kb = bytes / 1024
  return `${kb.toFixed(0)} KB`
}
