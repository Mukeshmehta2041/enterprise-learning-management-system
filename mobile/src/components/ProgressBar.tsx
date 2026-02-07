import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  color = "#4f46e5",
  backgroundColor = "#e2e8f0",
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View
      className={`rounded-full overflow-hidden ${className}`}
      style={{ height, backgroundColor }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
