import React, { useState } from 'react'
import { View, ScrollView, Switch, Linking, Alert } from 'react-native'
import { Stack } from 'expo-router'
import { AppText } from '../../src/components/AppText'
import { ListItem } from '../../src/components/ListItem'

export default function PrivacySettingsScreen() {
  const [preferences, setPreferences] = useState({
    marketingEmails: true,
    announcements: true,
    pushNotifications: true,
    analytics: true,
  })

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
    // In a real app, we would call an API here to persist the setting
  }

  const handleDataExport = () => {
    Alert.alert(
      'Request Data Export',
      'We will prepare a file containing your personal data and send it to your registered email address. This may take up to 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () =>
            Alert.alert('Request Received', 'Your data export request has been submitted.'),
        },
      ],
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent and cannot be undone. All your progress and data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Account Deleted',
              'Your account deletion request has been submitted and will be processed.',
            ),
        },
      ],
    )
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the link.')
    })
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Privacy & Data' }} />

      <View className="mt-6">
        <AppText variant="caption" weight="semibold" color="muted" className="px-4 mb-2 uppercase">
          Communication Preferences
        </AppText>
        <ListItem
          title="Marketing Emails"
          subtitle="Receive updates about new courses and special offers."
          rightElement={
            <Switch
              value={preferences.marketingEmails}
              onValueChange={() => togglePreference('marketingEmails')}
            />
          }
        />
        <ListItem
          title="Announcements"
          subtitle="Get important updates about courses you're enrolled in."
          rightElement={
            <Switch
              value={preferences.announcements}
              onValueChange={() => togglePreference('announcements')}
            />
          }
        />
        <ListItem
          title="Push Notifications"
          subtitle="Allow the app to send you notifications on this device."
          rightElement={
            <Switch
              value={preferences.pushNotifications}
              onValueChange={() => togglePreference('pushNotifications')}
            />
          }
        />
      </View>

      <View className="mt-6">
        <AppText variant="caption" weight="semibold" color="muted" className="px-4 mb-2 uppercase">
          Data & Tracking
        </AppText>
        <ListItem
          title="Usage Analytics"
          subtitle="Help us improve by sharing anonymous usage data."
          rightElement={
            <Switch
              value={preferences.analytics}
              onValueChange={() => togglePreference('analytics')}
            />
          }
        />
        <ListItem
          title="Privacy Policy"
          leftIcon="document-text-outline"
          onPress={() => openLink('https://example.com/privacy')}
        />
        <ListItem
          title="Terms of Service"
          leftIcon="information-circle-outline"
          onPress={() => openLink('https://example.com/terms')}
        />
      </View>

      <View className="mt-6">
        <AppText variant="caption" weight="semibold" color="muted" className="px-4 mb-2 uppercase">
          Personal Data Actions
        </AppText>
        <ListItem
          title="Export My Data"
          subtitle="Request a copy of your personal information."
          leftIcon="download-outline"
          onPress={handleDataExport}
        />
        <ListItem
          title="Delete My Account"
          subtitle="Permanently remove your account and all data."
          leftIcon="trash-outline"
          destructive
          onPress={handleDeleteAccount}
        />
      </View>

      <View className="p-6 mt-4">
        <AppText variant="small" color="muted" className="text-center">
          LMS Mobile v1.0.0
        </AppText>
      </View>
    </ScrollView>
  )
}
