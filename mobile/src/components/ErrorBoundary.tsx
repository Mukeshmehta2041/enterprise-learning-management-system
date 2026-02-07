import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center p-6 bg-background">
          <Ionicons name="alert-circle-outline" size={80} color="#ef4444" />
          <AppText variant="h1" className="mt-6 mb-2">Oops!</AppText>
          <AppText variant="body" color="muted" className="text-center mb-8">
            Something went wrong. Don't worry, we've been notified.
          </AppText>
          <Button
            title="Try Again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
