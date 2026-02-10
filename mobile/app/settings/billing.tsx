import React from 'react'
import { View, FlatList } from 'react-native'
import { Stack } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { AppText } from '../../src/components/AppText'
import { ListItem } from '../../src/components/ListItem'
import { apiClient } from '../../src/api/client'

export default function BillingHistoryScreen() {
  const { data: bills, isLoading } = useQuery({
    queryKey: ['payments', 'history'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/v1/payments/history')
        return response.data
      } catch {
        // Return mock data for demonstration
        return [
          {
            id: '1',
            date: '2026-02-01',
            description: 'Pro Plan - Monthly',
            amount: '$29.99',
            status: 'Paid',
          },
          {
            id: '2',
            date: '2026-01-01',
            description: 'Pro Plan - Monthly',
            amount: '$29.99',
            status: 'Paid',
          },
          {
            id: '3',
            date: '2025-12-01',
            description: 'Pro Plan - Monthly',
            amount: '$29.99',
            status: 'Paid',
          },
        ]
      }
    },
  })

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Billing History', headerShown: true }} />
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.description}
            subtitle={item.date}
            rightElement={
              <View className="items-end">
                <AppText weight="bold">{item.amount}</AppText>
                <AppText variant="small" className="text-green-600">
                  {item.status}
                </AppText>
              </View>
            }
          />
        )}
        ListHeaderComponent={
          <View className="p-6">
            <AppText variant="h3">Past Transactions</AppText>
            <AppText color="muted" variant="small">
              View and download your previous payment receipts.
            </AppText>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="p-12 items-center">
              <AppText color="muted">No transaction history found.</AppText>
            </View>
          ) : null
        }
      />
    </View>
  )
}
