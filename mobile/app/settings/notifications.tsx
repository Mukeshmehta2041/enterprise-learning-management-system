import React from 'react'
import { View, ScrollView, Switch, ActivityIndicator } from 'react-native'
import { Stack } from 'expo-router'
import { AppText } from '../../src/components/AppText'
import { Card } from '../../src/components/Card'
import { useNotificationPreferences, useUpsertNotificationPreference, NotificationChannel, NotificationEventType } from '../../src/hooks/useNotificationPreferences'

export default function NotificationSettingsScreen() {
  const { data: preferences, isLoading } = useNotificationPreferences()
  const upsertPreference = useUpsertNotificationPreference()

  const preferenceGroups: {
    title: string
    channel: NotificationChannel
    items: { label: string; description: string; eventType: NotificationEventType }[]
  }[] = [
      {
        title: 'In-app Alerts',
        channel: 'IN_APP',
        items: [
          {
            label: 'New lessons published',
            description: 'Get notified when new lessons unlock in your enrolled courses.',
            eventType: 'LessonPublished',
          },
          {
            label: 'Lesson updates',
            description: 'Get notified when lesson content is updated.',
            eventType: 'LessonUpdated',
          },
          {
            label: 'New assignments posted',
            description: 'Stay ahead when instructors post new assignments.',
            eventType: 'AssignmentCreated',
          },
          {
            label: 'Assignment updates',
            description: 'Get notified when assignment details or deadlines change.',
            eventType: 'AssignmentUpdated',
          },
          {
            label: 'Upcoming deadlines',
            description: 'Reminders for assignments due within 24 hours.',
            eventType: 'AssignmentDueSoon',
          },
          {
            label: 'Assignment graded',
            description: 'Know right away when your submission is graded.',
            eventType: 'AssignmentGraded',
          },
        ],
      },
      {
        title: 'Push Notifications',
        channel: 'PUSH',
        items: [
          {
            label: 'Lesson announcements',
            description: 'Receive a push when a lesson is published.',
            eventType: 'LessonPublished',
          },
          {
            label: 'Lesson updates',
            description: 'Receive a push when a lesson is updated.',
            eventType: 'LessonUpdated',
          },
          {
            label: 'Assignment alerts',
            description: 'Receive a push for new or updated assignments.',
            eventType: 'AssignmentCreated',
          },
          {
            label: 'Assignment updates',
            description: 'Receive a push when assignments are modified.',
            eventType: 'AssignmentUpdated',
          },
          {
            label: 'Deadline reminders',
            description: 'Push notification for upcoming deadlines.',
            eventType: 'AssignmentDueSoon',
          },
        ],
      },
      {
        title: 'Email Alerts',
        channel: 'EMAIL',
        items: [
          {
            label: 'Weekly Newsletter',
            description: 'Summaries of your progress and new content.',
            eventType: 'General',
          },
          {
            label: 'Course Updates',
            description: 'Emails for significant changes to your courses.',
            eventType: 'LessonPublished',
          }
        ],
      },
    ]

  const isEnabled = (eventType: NotificationEventType, channel: NotificationChannel) => {
    const pref = preferences?.find(p => p.eventType === eventType && p.channel === channel && p.courseId === null)
    return pref ? pref.enabled : true // Default to true
  }

  const togglePreference = (eventType: NotificationEventType, channel: NotificationChannel) => {
    const current = isEnabled(eventType, channel)
    upsertPreference.mutate({
      eventType,
      channel,
      enabled: !current,
      courseId: null
    })
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ headerTitle: 'Notification Settings', headerShown: true }} />
      <View className="p-6">
        <AppText variant="body" color="muted" className="mb-6">
          Choose what you want to be notified about and where you want to receive those alerts.
        </AppText>

        {preferenceGroups.map((group, groupIdx) => (
          <View key={groupIdx} className="mb-8">
            <AppText variant="h3" weight="bold" className="mb-4">
              {group.title}
            </AppText>
            <Card className="p-0 overflow-hidden">
              {group.items.map((item, itemIdx) => (
                <View
                  key={itemIdx}
                  className={`flex-row items-center justify-between p-4 ${itemIdx < group.items.length - 1 ? 'border-b border-slate-50' : ''
                    }`}
                >
                  <View className="flex-1 mr-4">
                    <AppText variant="body" weight="semibold">
                      {item.label}
                    </AppText>
                    <AppText variant="small" color="muted">
                      {item.description}
                    </AppText>
                  </View>
                  <Switch
                    value={isEnabled(item.eventType, group.channel)}
                    onValueChange={() => togglePreference(item.eventType, group.channel)}
                    trackColor={{ false: '#cbd5e1', true: '#a5b4fc' }}
                    thumbColor={isEnabled(item.eventType, group.channel) ? '#4f46e5' : '#f1f5f9'}
                  />
                </View>
              ))}
            </Card>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
