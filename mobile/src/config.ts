import Constants from 'expo-constants'

interface AppConfig {
  apiUrl: string
  socketUrl: string
  environment: 'development' | 'staging' | 'production'
  sentryDsn?: string
  version: string
}

const extra = Constants.expoConfig?.extra || {}

const getApiUrl = () => {
  if (extra.apiUrl && !extra.apiUrl.includes('localhost')) {
    return extra.apiUrl;
  }

  // If we're in development and using localhost, try to use the host's IP address
  // This allows the app to work on physical devices and simulators
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    if (debuggerHost) {
      const ip = debuggerHost.split(':')[0];
      return `http://${ip}:8080`;
    }
  }

  return extra.apiUrl || 'http://localhost:8080';
};

const apiUrl = getApiUrl();

export const Config: AppConfig = {
  // Root API URL (no trailing /api). Individual calls should include the /api prefix,
  // e.g. apiClient.get('/api/v1/users/me')
  apiUrl,
  socketUrl: extra.socketUrl || apiUrl,
  environment: extra.environment || 'development',
  sentryDsn: extra.sentryDsn,
  version: Constants.expoConfig?.version || '1.0.0',
}

export const isDev = Config.environment === 'development'
export const isProd = Config.environment === 'production'
