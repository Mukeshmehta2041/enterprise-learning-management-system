import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Button, Input, Select, Textarea } from '@/shared/ui'

const basicInfoSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description should be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  level: z.string().min(1, 'Please select a level'),
  price: z.number().min(0, 'Price cannot be negative'),
  thumbnailUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  completionThreshold: z.number().min(0).max(100),
  requireAllAssignments: z.boolean(),
})

type BasicInfoValues = z.infer<typeof basicInfoSchema>

interface BasicInfoFormProps {
  initialData?: Partial<BasicInfoValues>
  defaultValues?: Partial<BasicInfoValues>
  onNext?: (data: BasicInfoValues) => void
  onSubmit?: (data: BasicInfoValues) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function BasicInfoForm({
  initialData,
  defaultValues,
  onNext,
  onSubmit,
  onCancel,
  isSubmitting,
}: BasicInfoFormProps) {
  const mergedDefaultValues = defaultValues || initialData || {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: mergedDefaultValues.title || '',
      description: mergedDefaultValues.description || '',
      category: mergedDefaultValues.category || '',
      level: mergedDefaultValues.level || '',
      price: mergedDefaultValues.price || 0,
      thumbnailUrl: mergedDefaultValues.thumbnailUrl || '',
      completionThreshold: mergedDefaultValues.completionThreshold || 100,
      requireAllAssignments: mergedDefaultValues.requireAllAssignments || false,
    },
  })

  const handleFormSubmit = (data: BasicInfoValues) => {
    if (onSubmit) onSubmit(data)
    if (onNext) onNext(data)
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Input
          label="Course Title"
          placeholder="e.g. Advanced TypeScript Patterns"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Category"
            error={errors.category?.message}
            {...register('category')}
            options={[
              { label: 'Select Category', value: '' },
              { label: 'Programming', value: 'PROGRAMMING' },
              { label: 'Design', value: 'DESIGN' },
              { label: 'Business', value: 'BUSINESS' },
              { label: 'Marketing', value: 'MARKETING' },
            ]}
          />

          <Select
            label="Level"
            error={errors.level?.message}
            {...register('level')}
            options={[
              { label: 'Select Level', value: '' },
              { label: 'Beginner', value: 'BEGINNER' },
              { label: 'Intermediate', value: 'INTERMEDIATE' },
              { label: 'Advanced', value: 'ADVANCED' },
            ]}
          />

          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Thumbnail URL"
          placeholder="https://example.com/image.jpg"
          error={errors.thumbnailUrl?.message}
          {...register('thumbnailUrl')}
          helperText="A compelling image that represents your course."
        />

        <Textarea
          label="Course Description"
          placeholder="Describe what students will learn..."
          rows={5}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">
            Completion Rules & Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Completion Threshold (%)"
              type="number"
              min="0"
              max="100"
              error={errors.completionThreshold?.message}
              {...register('completionThreshold', { valueAsNumber: true })}
              helperText="Minimum % of lessons completed to mark course as finished."
            />
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-sm font-medium text-slate-700">Assignments Requirement</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="requireAllAssignments"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  {...register('requireAllAssignments')}
                />
                <label htmlFor="requireAllAssignments" className="text-sm text-slate-600">
                  Require all mandatory assignments to be completed
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} type="button">
              Cancel
            </Button>
          )}
          <Button type="submit" className={!onCancel ? 'ml-auto' : ''} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (onNext ? 'Continue to Curriculum' : 'Save Changes')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
