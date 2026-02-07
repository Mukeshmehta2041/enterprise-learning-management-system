import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.prototype.name;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, icon = 'search-outline', actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-10 bg-background">
      <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-6">
        <Ionicons name={icon as any} size={40} color="#cbd5e1" />
      </View>
      <AppText variant="h3" className="mb-2 text-center">{title}</AppText>
      <AppText variant="body" color="muted" className="text-center mb-8">
        {description}
      </AppText>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outline" />
      )}
    </View>
  );
}
