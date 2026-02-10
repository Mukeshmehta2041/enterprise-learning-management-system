import React, { useState } from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AppText } from '../src/components/AppText'
import { Input } from '../src/components/Input'
import { Button } from '../src/components/Button'
import { Select } from '../src/components/Select'
import { useNotificationStore } from '../src/state/useNotificationStore'
import { useAuthStore } from '../src/state/useAuthStore'
import { apiClient } from '../src/api/client'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR']),
  interests: z.string().min(1, 'Please list a few interests'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileSetupScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 3
  const showNotification = useNotificationStore((state) => state.showNotification)
  const user = useAuthStore((state) => state.user)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: '',
      role: 'STUDENT',
      interests: '',
      website: '',
    },
  })

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProfileFormData)[] = []
    if (step === 1) fieldsToValidate = ['fullName', 'bio']
    if (step === 2) fieldsToValidate = ['role', 'interests']

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      // API call to update profile
      await apiClient.put('/api/v1/users/profile', data)
      showNotification('Profile setup complete!', 'success')
      router.replace('/(tabs)')
    } catch (error: any) {
      showNotification(error.message || 'Failed to update profile', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View key="step1">
            <AppText variant="h2" className="mb-2">
              Basic Info
            </AppText>
            <AppText color="muted" className="mb-6">
              Tell us a bit about yourself.
            </AppText>

            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.fullName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bio"
                  placeholder="Short bio about you..."
                  multiline
                  numberOfLines={4}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.bio?.message}
                  inputClassName="h-32 pt-3"
                />
              )}
            />
          </View>
        )
      case 2:
        return (
          <View key="step2">
            <AppText variant="h2" className="mb-2">
              Your Role & Interests
            </AppText>
            <AppText color="muted" className="mb-6">
              Help us personalize your experience.
            </AppText>

            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Primary Role"
                  value={value}
                  onValueChange={onChange}
                  options={[
                    { label: 'Student', value: 'STUDENT' },
                    { label: 'Instructor', value: 'INSTRUCTOR' },
                  ]}
                  error={errors.role?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="interests"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Interests"
                  placeholder="e.g. React, Java, Design"
                  helperText="Separate interests with commas"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.interests?.message}
                />
              )}
            />
          </View>
        )
      case 3:
        return (
          <View key="step3">
            <AppText variant="h2" className="mb-2">
              Social Presence
            </AppText>
            <AppText color="muted" className="mb-6">
              Optional links to your work.
            </AppText>

            <Controller
              control={control}
              name="website"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Website / Portfolio"
                  placeholder="https://example.com"
                  autoCapitalize="none"
                  keyboardType="url"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.website?.message}
                />
              )}
            />
          </View>
        )
      default:
        return null
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <AppText variant="caption" weight="bold" color="primary">
              STEP {step} OF {totalSteps}
            </AppText>
            <AppText variant="caption" color="muted">
              {Math.round((step / totalSteps) * 100)}% Complete
            </AppText>
          </View>
          <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <Animated.View
              className="h-full bg-indigo-600"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </View>
        </View>

        <View className="flex-1">{renderStep()}</View>

        <View className="flex-row gap-4 mt-8">
          {step > 1 && (
            <Button
              title="Back"
              variant="outline"
              className="flex-1"
              onPress={prevStep}
              disabled={isSubmitting}
            />
          )}
          <Button
            title={step === totalSteps ? 'Complete Setup' : 'Continue'}
            className="flex-2"
            onPress={step === totalSteps ? handleSubmit(onSubmit) : nextStep}
            loading={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
