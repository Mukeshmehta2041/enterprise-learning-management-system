import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Button, Input, Select, Textarea } from '@/shared/ui'
import { useCreateAndUploadContent } from '../../api/useContent'
import { Loader2, Upload, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const basicInfoSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description should be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  level: z.string().min(1, 'Please select a level'),
  price: z.number().min(0, 'Price cannot be negative'),
  thumbnailUrl: z.string().optional().or(z.literal('')),
  completionThreshold: z.number().min(0).max(100),
  requireAllAssignments: z.boolean(),
})

type BasicInfoValues = z.infer<typeof basicInfoSchema>

interface BasicInfoFormProps {
  courseId: string
  initialData?: Partial<BasicInfoValues>
  defaultValues?: Partial<BasicInfoValues>
  onNext?: (data: BasicInfoValues) => void
  onSubmit?: (data: BasicInfoValues) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function BasicInfoForm({
  courseId,
  initialData,
  defaultValues,
  onNext,
  onSubmit,
  onCancel,
  isSubmitting: isExternalSubmitting,
}: BasicInfoFormProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadThumbnail = useCreateAndUploadContent()

  const mergedDefaultValues = defaultValues || initialData || {}

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const currentThumbnailUrl = watch('thumbnailUrl')

  const uploadFile = async (file: File) => {
    setSelectedFile(file)
    try {
      const content = await uploadThumbnail.mutateAsync({
        courseId,
        title: `Thumbnail for ${watch('title') || 'Course'}`,
        type: 'IMAGE',
        file,
        onProgress: (progress) => setUploadProgress(progress),
      })

      // In a real S3 setup, we might need a separate call to get the public URL or just store the path
      // For now we simulate the public URL based on path
      const url = `https://storage.lms.com/media/content/${courseId}/thumbnail/${file.name}`
      setValue('thumbnailUrl', url)
      setUploadProgress(null)
    } catch (error) {
      console.error('Thumbnail upload failed:', error)
      setUploadProgress(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      uploadFile(file)
    }
  }

  const removeThumbnail = () => {
    setValue('thumbnailUrl', '')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFormSubmit = (data: BasicInfoValues) => {
    if (onSubmit) onSubmit(data)
    if (onNext) onNext(data)
  }

  const isSubmitting = isExternalSubmitting || uploadThumbnail.isPending

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

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Course Thumbnail</label>
          <div className="flex items-start gap-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative h-32 w-56 bg-slate-50 rounded-xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden',
                isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-300 hover:border-slate-400'
              )}
            >
              {currentThumbnailUrl ? (
                <>
                  <img src={currentThumbnailUrl} alt="Thumbnail" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-slate-600 hover:text-red-600 transition-colors shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload className={cn('h-10 w-10 mb-2 transition-transform', isDragging && 'animate-bounce')} />
                  <p className="text-xs font-medium">Drag and drop here</p>
                </div>
              )}
              {uploadProgress !== null && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs font-bold text-slate-700">{uploadProgress}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-fit"
                >
                  {currentThumbnailUrl ? 'Change Image' : 'Upload Image'}
                </Button>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Recommended: 1280x720px (16:9). JPG, PNG or WebP.<br />
                  Maximum size: 5MB.
                </p>
              </div>

              {currentThumbnailUrl && (
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 w-fit px-2 py-1 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Image uploaded
                </div>
              )}
            </div>
          </div>
          {errors.thumbnailUrl && (
            <p className="text-xs text-red-500 mt-1">{errors.thumbnailUrl.message}</p>
          )}
        </div>

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
