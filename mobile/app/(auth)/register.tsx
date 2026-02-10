import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
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

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Step 1: Register
      await apiClient.post('/api/v1/users', {
        displayName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: 'STUDENT'
      });

      // Step 2: Login
      const loginResponse = await apiClient.post('/api/v1/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { access_token } = loginResponse.data;

      // Set the token first
      await setAuth(null, access_token);

      // Fetch the full user profile
      const userResponse = await apiClient.get('/api/v1/users/me');
      const userData = userResponse.data;

      const user = {
        id: userData.id,
        email: userData.email,
        fullName: userData.displayName || userData.fullName || userData.email,
        role: Array.isArray(userData.roles) ? userData.roles[0] : userData.role,
        avatarUrl: userData.avatarUrl,
        bio: userData.bio,
        createdAt: userData.createdAt,
      };

      await setAuth(user, access_token);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Registration error:', error);
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
            <AppText variant="h1" className="mb-2">Create Account</AppText>
            <AppText variant="body" color="muted">Join our community of learners.</AppText>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    placeholder="John"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.lastName?.message}
                  />
                )}
              />
            </View>
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            className="mt-4"
          />

          <View className="flex-row justify-center mt-8">
            <AppText color="muted">Already have an account? </AppText>
            <Button
              title="Sign In"
              variant="ghost"
              onPress={() => router.push('/login')}
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
