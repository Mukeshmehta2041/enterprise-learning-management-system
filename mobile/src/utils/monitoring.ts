import * as Sentry from '@sentry/react-native'
import { Config } from '../config'

/**
 * Simplified Monitoring utility.
 * In a real production app, this would wrap Sentry.init() or Firebase.
 */
export const Monitoring = {
  init: () => {
    if (Config.sentryDsn && Config.environment !== 'development') {
      if (__DEV__) {
        console.log(`[Monitoring] Initializing Sentry for env: ${Config.environment}`)
      }

      Sentry.init({
        dsn: Config.sentryDsn,
        environment: Config.environment,
        release: `lms-mobile@${Config.version}`,
        enableAutoSessionTracking: true,
      })
    } else if (__DEV__) {
      console.log(
        `[Monitoring] Skipping monitoring for env: ${Config.environment}, missing DSN: ${!Config.sentryDsn
        }`,
      )
    }
  },

  logError: (error: Error, context?: Record<string, unknown>) => {
    if (__DEV__) {
      console.error(`[Monitoring] ${error.message}`, context)
    }

    if (Config.sentryDsn && Config.environment !== 'development') {
      Sentry.captureException(error, { extra: context })
    }
  },

  logEvent: (name: string, data?: Record<string, unknown>) => {
    if (__DEV__) {
      console.log(`[Monitoring] Event: ${name}`, data)
    }
    // Analytics.logEvent(name, data);
  },
}
