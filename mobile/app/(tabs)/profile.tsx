import { View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { AppText } from '../../src/components/AppText'
import { Button } from '../../src/components/Button'
import { ListItem } from '../../src/components/ListItem'
import { useAuthStore } from '../../src/state/useAuthStore'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/(auth)/login')
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 items-center bg-white border-b border-slate-100">
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
          <AppText variant="h1" color="primary">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </AppText>
        </View>
        <AppText variant="h2">{user?.fullName}</AppText>
        <AppText color="muted">{user?.email}</AppText>
        <View className="bg-primary/10 px-3 py-1 rounded-full mt-2">
          <AppText variant="small" color="primary" weight="semibold">
            {user?.role || 'STUDENT'}
          </AppText>
        </View>
      </View>

      <View className="mt-6">
        <AppText variant="caption" weight="semibold" color="muted" className="px-6 mb-2">
          ACCOUNT SETTINGS
        </AppText>
        <ListItem
          title="Upgrade Plan"
          leftIcon="card-outline"
          onPress={() => router.push('/plans')}
        />
        <ListItem
          title="Billing History"
          leftIcon="receipt-outline"
          onPress={() => router.push('/settings/billing')}
        />
        <ListItem title="Edit Profile" leftIcon="person-outline" onPress={() => { }} />
        <ListItem title="Change Password" leftIcon="lock-closed-outline" onPress={() => { }} />
        <ListItem
          title="Notifications"
          leftIcon="notifications-outline"
          onPress={() => router.push('/notifications')}
        />
        <ListItem
          title="Appearance"
          leftIcon="color-palette-outline"
          onPress={() => router.push('/settings/appearance')}
        />
        <ListItem
          title="Privacy & Data"
          leftIcon="shield-checkmark-outline"
          onPress={() => router.push('/settings/privacy')}
        />
      </View>

      <View className="mt-6">
        <AppText variant="caption" weight="semibold" color="muted" className="px-6 mb-2">
          ABOUT
        </AppText>
        <ListItem
          title="Support & Feedback"
          leftIcon="help-circle-outline"
          onPress={() => router.push('/support')}
        />
        <ListItem
          title="Privacy Policy"
          leftIcon="document-text-outline"
          onPress={() => router.push('/privacy-policy')}
        />
        <ListItem
          title="Terms of Service"
          leftIcon="information-circle-outline"
          onPress={() => router.push('/terms')}
        />
        <AppText variant="caption" color="muted" className="px-6 mt-4 opacity-50">
          Version 1.0.0 (Build 38)
        </AppText>
      </View>

      <View className="p-6 mt-4">
        <Button title="Log Out" variant="danger" onPress={handleLogout} />
      </View>
    </ScrollView>
  )
}
