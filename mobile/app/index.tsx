import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = false; // TODO: replace with auth state

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
