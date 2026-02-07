import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/state/useAuthStore';
import { useNotificationStore } from '../src/state/useNotificationStore';
import { Banner } from '../src/components/Banner';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { Monitoring } from '../src/utils/monitoring';
import "../global.css";

// Initialize monitoring
Monitoring.init();

// Disable screens to resolve type mismatch errors in RN 0.81 + New Architecture on iOS
enableScreens(false);

const queryClient = new QueryClient();

export default function RootLayout() {
  const { user, token, isLoading, initialize, setRedirectPath } = useAuthStore();
  const { message, type, isVisible, hideNotification } = useNotificationStore();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = !!token;

    if (!isAuthenticated && !inAuthGroup && segments.length > 0) {
      // Save the path user was trying to reach for deep linking
      setRedirectPath(pathname);
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, segments, isLoading, pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Banner
          message={message}
          type={type}
          isVisible={isVisible}
          onHide={hideNotification}
        />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
