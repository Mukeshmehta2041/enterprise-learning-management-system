import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, Alert } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { AppText } from '../src/components/AppText'
import { Button } from '../src/components/Button'
import { useNotificationStore } from '../src/state/useNotificationStore'
import { analytics } from '../src/utils/analytics'

export default function CheckoutScreen() {
  const { planId, planName, price } = useLocalSearchParams()
  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')
  const router = useRouter()
  const { showNotification } = useNotificationStore()

  useEffect(() => {
    analytics.track('payment_started', {
      planId: String(planId),
      planName: String(planName),
      price: String(price),
    })
  }, [])

  const handlePayment = () => {
    setStatus('processing')
    // Simulate payment processing
    setTimeout(() => {
      setStatus('success')
      showNotification(`Successfully subscribed to ${planName}!`, 'success')
      analytics.track('payment_completed', {
        planId: String(planId),
        planName: String(planName),
        price: String(price),
      })
    }, 2000)
  }

  const handleCancel = () => {
    Alert.alert('Cancel Payment', 'Are you sure you want to cancel the checkout process?', [
      { text: 'Continue Payment', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => router.back() },
    ])
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Secure Checkout', headerShown: true }} />

      {status === 'pending' && (
        <View className="flex-1 p-6 justify-between">
          <View>
            <AppText variant="h2" className="mb-4">
              Order Summary
            </AppText>
            <View className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <View className="flex-row justify-between mb-4">
                <AppText weight="medium">{planName} Subscription</AppText>
                <AppText weight="bold">{price}</AppText>
              </View>
              <View className="h-[1px] bg-slate-200 my-4" />
              <View className="flex-row justify-between">
                <AppText variant="h3">Total</AppText>
                <AppText variant="h3" color="primary">
                  {price}
                </AppText>
              </View>
            </View>
            <AppText variant="small" color="muted" className="mt-6 text-center">
              By proceeding, you agree to our Terms of Service and Privacy Policy. This is a secure
              256-bit encrypted payment.
            </AppText>
          </View>

          <View className="gap-4">
            <Button title={`Pay ${price}`} onPress={handlePayment} />
            <Button title="Cancel" variant="outline" onPress={handleCancel} />
          </View>
        </View>
      )}

      {status === 'processing' && (
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#4f46e5" />
          <AppText variant="h3" className="mt-6">
            Processing Payment
          </AppText>
          <AppText color="muted" className="mt-2 text-center">
            Please do not close the app or refresh the page...
          </AppText>
        </View>
      )}

      {status === 'success' && (
        <View className="flex-1 items-center justify-center p-10">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8">
            <AppText variant="h1" className="text-green-600">
              ✓
            </AppText>
          </View>
          <AppText variant="h2" className="mb-4">
            Payment Successful!
          </AppText>
          <AppText color="muted" className="text-center mb-10">
            Thank you for your purchase. Your {planName} plan is now active. A receipt has been sent
            to your email.
          </AppText>
          <Button
            title="Back to Profile"
            className="w-full"
            onPress={() => router.replace('/(tabs)/profile')}
          />
        </View>
      )}
    </View>
  )
}
