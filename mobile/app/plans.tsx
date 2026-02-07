import React from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { apiClient } from '../src/api/client';
import { Ionicons } from '@expo/vector-icons';

export default function PlansScreen() {
  const router = useRouter();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['payments', 'plans'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/payments/plans');
      return response.data || [
        { id: '1', name: 'Starter', price: '$9.99', period: 'month', features: ['Access to 10 courses', 'Mobile access', 'Basic support'] },
        { id: '2', name: 'Pro', price: '$29.99', period: 'month', features: ['Unlimited courses', 'Offline downloads', 'Priority support', 'Certificate of completion'], popular: true },
        { id: '3', name: 'Enterprise', price: '$99.99', period: 'year', features: ['Team management', 'Custom reporting', 'Dedicated manager'] },
      ];
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiClient.post('/api/v1/payments/checkout', { planId });
      return response.data;
    },
    onSuccess: (data) => {
      // In a real app, you might open a Stripe Checkout URL in a WebView or Browser
      Alert.alert('Checkout Started', 'Handing off to secure payment provider...');
      if (data.checkoutUrl) {
        // router.push({ pathname: '/checkout-webview', params: { url: data.checkoutUrl } });
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to initialize checkout');
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerTitle: 'Subscription Plans', headerShown: true }} />
      <ScrollView className="flex-1 p-6">
        <AppText variant="h2" className="mb-2">Choose your plan</AppText>
        <AppText color="muted" className="mb-8">Upgrade to unlock full potential and exclusive content.</AppText>

        {plans?.map((plan: any) => (
          <Card
            key={plan.id}
            className={`mb-6 p-6 border-2 ${plan.popular ? 'border-primary' : 'border-white shadow-sm'}`}
          >
            {plan.popular && (
              <View className="bg-primary self-start px-3 py-1 rounded-full mb-4">
                <AppText variant="small" className="text-white font-bold">MOST POPULAR</AppText>
              </View>
            )}
            <AppText variant="h3">{plan.name}</AppText>
            <View className="flex-row items-baseline mt-2 mb-6">
              <AppText variant="h1">{plan.price}</AppText>
              <AppText color="muted">/{plan.period}</AppText>
            </View>

            <View className="mb-8">
              {plan.features.map((feature: string, idx: number) => (
                <View key={idx} className="flex-row items-center mb-3">
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  <AppText className="ml-3" variant="body">{feature}</AppText>
                </View>
              ))}
            </View>

            <Button
              title={plan.popular ? "Get Started Now" : "Select Plan"}
              variant={plan.popular ? "primary" : "outline"}
              onPress={() => checkoutMutation.mutate(plan.id)}
              loading={checkoutMutation.isPending && checkoutMutation.variables === plan.id}
              disabled={checkoutMutation.isPending}
            />
          </Card>
        ))}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
