import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Button, Input, Select, TextMuted } from '@/shared/ui'
import { DollarSign, Eye, EyeOff } from 'lucide-react'

const pricingSettingsSchema = z.object({
  price: z.number().min(0, 'Price cannot be negative'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

type PricingSettingsValues = z.infer<typeof pricingSettingsSchema>

interface PricingSettingsFormProps {
  defaultValues?: Partial<PricingSettingsValues>
  onSubmit?: (data: PricingSettingsValues) => void
  isSubmitting?: boolean
}

export function PricingSettingsForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: PricingSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PricingSettingsValues>({
    resolver: zodResolver(pricingSettingsSchema),
    defaultValues: {
      price: defaultValues?.price || 0,
      status: defaultValues?.status || 'DRAFT',
    },
  })

  const currentStatus = useWatch({
    control,
    name: 'status',
  })

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit((data) => onSubmit?.(data))} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign size={20} className="text-slate-400" />
              Course Pricing
            </h3>
            <div className="max-w-xs">
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
                helperText="Set to 0 for a free course."
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {currentStatus === 'PUBLISHED' ? (
                <Eye size={20} className="text-green-500" />
              ) : (
                <EyeOff size={20} className="text-slate-400" />
              )}
              Course Visibility
            </h3>
            <div className="max-w-xs">
              <Select
                label="Status"
                error={errors.status?.message}
                {...register('status')}
                options={[
                  { label: 'Draft - Hidden from catalog', value: 'DRAFT' },
                  { label: 'Published - Visible to all', value: 'PUBLISHED' },
                  { label: 'Archived - Hidden and no longer for sale', value: 'ARCHIVED' },
                ]}
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <TextMuted className="text-sm">
                {currentStatus === 'DRAFT' && 'Your course is a draft. Students cannot see it or enroll.'}
                {currentStatus === 'PUBLISHED' && 'Your course is live! Students can discover and enroll in it.'}
                {currentStatus === 'ARCHIVED' && 'Students can no longer enroll, but existing students can still access their content.'}
              </TextMuted>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Pricing & Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
