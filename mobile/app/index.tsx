import { Redirect } from 'expo-router'
import { useAuthStore } from '../src/state/useAuthStore'

export default function Index() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = !!user

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/(tabs)" />
}
