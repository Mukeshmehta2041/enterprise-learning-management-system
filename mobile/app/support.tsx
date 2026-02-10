import React, { useState } from 'react'
import { View, ScrollView, TextInput } from 'react-native'
import { AppText } from '../src/components/AppText'
import { Button } from '../src/components/Button'
import { analytics } from '../src/utils/analytics'
import { useNotificationStore } from '../src/state/useNotificationStore'
import { useRouter } from 'expo-router'

export default function SupportScreen() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const showNotification = useNotificationStore((state) => state.showNotification)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!message.trim()) return

    setSending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    analytics.track('assignment_submitted', { type: 'support_feedback' }) // Reusing event or added new one
    showNotification('Thank you for your feedback! We will get back to you soon.', 'success')
    setSending(false)
    router.back()
  }

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <AppText variant="h2" className="mb-2">How can we help?</AppText>
      <AppText color="muted" className="mb-6">
        Found a bug or have a suggestion? Let us know below.
      </AppText>

      <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-6">
        <TextInput
          multiline
          numberOfLines={6}
          placeholder="Describe your issue or feedback..."
          className="text-slate-900 text-base h-40"
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />
      </View>

      <Button
        title="Send Feedback"
        onPress={handleSubmit}
        loading={sending}
        disabled={!message.trim()}
      />

      <View className="mt-10 items-center">
        <AppText variant="small" color="muted">Or email us at</AppText>
        <AppText variant="body" weight="bold" color="primary">support@lms-v2.example.com</AppText>
      </View>
    </ScrollView>
  )
}
