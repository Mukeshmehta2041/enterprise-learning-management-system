import { useForm, useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { Card, Button, Input, IconButton, Select } from '@/shared/ui'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { ModuleInput } from '@/shared/types/course'

interface CurriculumFormProps {
  initialModules?: ModuleInput[]
  initialData?: { modules?: ModuleInput[] } // For compatibility with wizard
  onSave?: (modules: ModuleInput[]) => void
  onNext?: (data: { modules: ModuleInput[] }) => void // For compatibility with wizard
  onBack?: () => void
}

export function CurriculumForm({
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
  } = useFieldArray({
    control,
    name: 'modules',
  })

  const onSubmit = (data: { modules: ModuleInput[] }) => {
    if (onSave) onSave(data.modules)
    if (onNext) onNext(data)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {moduleFields.map((module, moduleIndex) => (
          <Card key={module.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical className="text-slate-300" />
                <Input
                  placeholder={`Module ${moduleIndex + 1} Title`}
                  className="max-w-md font-bold"
                  {...register(`modules.${moduleIndex}.title` as const)}
                />
              </div>
              <IconButton
                icon={<Trash2 size={18} />}
                variant="ghost"
                className="text-slate-400 hover:text-rose-500"
                onClick={() => removeModule(moduleIndex)}
                aria-label="Delete module"
              />
            </div>

            <LessonsList
              moduleIndex={moduleIndex}
              control={control}
              register={register}
            />
          </Card>
        ))}

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
  register
}: {
  moduleIndex: number,
  control: Control<{ modules: ModuleInput[] }>,
  register: UseFormRegister<{ modules: ModuleInput[] }>
}) {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons` as const,
  })

  return (
    <div className="ml-8 space-y-3 mt-4">
      {lessonFields.map((lesson, lessonIndex) => (
        <div
          key={lesson.id}
          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group"
        >
          <div className="flex-shrink-0">
            <Select
              {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.type` as const)}
              className="w-auto border-none bg-transparent"
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
            className="bg-transparent border-transparent focus:bg-white flex-1"
            {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.title` as const)}
          />
          <IconButton
            icon={<Trash2 size={16} />}
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
            onClick={() => removeLesson(lessonIndex)}
            aria-label="Remove lesson"
          />
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 ml-3"
        onClick={() => appendLesson({ title: '', type: 'VIDEO' })}
      >
        <Plus size={16} />
        Add Lesson
      </button>
    </div>
  )
}
