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
})

type BasicInfoValues = z.infer<typeof basicInfoSchema>

interface BasicInfoFormProps {
  initialData?: Partial<BasicInfoValues>
  defaultValues?: Partial<BasicInfoValues>
  onNext?: (data: BasicInfoValues) => void
  onSubmit?: (data: BasicInfoValues) => void
  onCancel?: () => void
}

export function BasicInfoForm({
  initialData,
  defaultValues,
  onNext,
  onSubmit,
  onCancel,
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
    },
  })

  const handleFormSubmit = (data: BasicInfoValues) => {
    if (onSubmit) onSubmit(data)
    if (onNext) onNext(data)
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Input
          label="Course Title"
          placeholder="e.g. Advanced TypeScript Patterns"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <Input
          label="Price ($)"
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register('price')}
        />

        <Textarea
          label="Course Description"
          placeholder="Describe what students will learn..."
          rows={5}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} type="button">
              Cancel
            </Button>
          )}
          <Button type="submit" className={!onCancel ? 'ml-auto' : ''}>
            {onNext ? 'Continue to Curriculum' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
