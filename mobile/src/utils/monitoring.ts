import { Config } from '../config';

/**
 * Simplified Monitoring utility. 
 * In a real production app, this would wrap Sentry.init() or Firebase.
 */
export const Monitoring = {
  init: () => {
    if (Config.environment === 'production' && Config.sentryDsn) {
      console.log(`[Monitoring] Initializing Sentry for env: ${Config.environment}`);
      // Sentry.init({ dsn: Config.sentryDsn });
    } else {
      console.log(`[Monitoring] Skipping monitoring for non-prod or missing DSN: ${Config.environment}`);
    }
  },

  logError: (error: Error, context?: any) => {
    console.error(`[Monitoring] ${error.message}`, context);
    if (Config.environment === 'production') {
      // Sentry.captureException(error, { extra: context });
    }
  },

  logEvent: (name: string, data?: any) => {
    console.log(`[Monitoring] Event: ${name}`, data);
    // Analytics.logEvent(name, data);
  }
};
