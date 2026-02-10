import { Platform } from 'react-native';
import { analytics } from './analytics';
import { Monitoring } from './monitoring';

export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDev = __DEV__;

  error(message: string, error?: any, severity: ErrorSeverity = 'error', context: ErrorContext = {}) {
    const errorDetails = {
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      severity,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (this.isDev) {
      console.error(`[Logger:Error] ${message}`, errorDetails);
    }

    Monitoring.logError(error instanceof Error ? error : new Error(message), {
      ...errorDetails,
    });

    // Capture in analytics if significant
    if (severity === 'fatal' || severity === 'error') {
      analytics.track('login_failed', { // Reusing for now or adding 'app_error'
        error_message: message,
        severity,
        ...context?.metadata
      });
    }

    // Errors are forwarded to Monitoring for Sentry capture.
  }

  warn(message: string, context: Record<string, any> = {}) {
    if (this.isDev) {
      console.warn(`[Logger:Warn] ${message}`, context);
    }
  }

  info(message: string, context: Record<string, any> = {}) {
    if (this.isDev) {
      console.info(`[Logger:Info] ${message}`, context);
    }
  }
}

export const logger = new Logger();
