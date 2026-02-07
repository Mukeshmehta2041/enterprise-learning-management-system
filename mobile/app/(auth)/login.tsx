import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppText } from '../../src/components/AppText';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/state/useAuthStore';
import { useNotificationStore } from '../../src/state/useNotificationStore';
import { apiClient } from '../../src/api/client';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth, redirectPath, setRedirectPath } = useAuthStore();
  const showNotification = useNotificationStore((state) => state.showNotification);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { user, token } = response.data;
      await setAuth(user, token);

      if (redirectPath) {
        const target = redirectPath;
        setRedirectPath(null);
        router.replace(target as any);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      showNotification(
        error.message || 'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        <View className="flex-1 justify-center">
          <View className="mb-10">
            <AppText variant="h1" className="mb-2">Welcome Back</AppText>
            <AppText variant="body" color="muted">Sign in to continue your learning journey.</AppText>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            className="mt-4"
          />

          <View className="flex-row justify-center mt-8">
            <AppText color="muted">Don't have an account? </AppText>
            <Button
              title="Sign Up"
              variant="ghost"
              onPress={() => router.push('/register')}
              size="sm"
              className="p-0"
              textClassName="text-primary font-bold"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
