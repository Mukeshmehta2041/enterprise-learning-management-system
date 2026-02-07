import Constants from 'expo-constants';

interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  sentryDsn?: string;
  version: string;
}

const extra = Constants.expoConfig?.extra || {};

export const Config: AppConfig = {
  apiUrl: extra.apiUrl || 'http://localhost:8080',
  environment: extra.environment || 'development',
  sentryDsn: extra.sentryDsn,
  version: Constants.expoConfig?.version || '1.0.0',
};

export const isDev = Config.environment === 'development';
export const isProd = Config.environment === 'production';
