import 'dotenv/config'
import type { ConfigContext, ExpoConfig } from 'expo/config'

type AppEnvironment = 'development' | 'staging' | 'production'

const normalizeEnv = (value?: string): AppEnvironment => {
  if (value === 'production' || value === 'staging') {
    return value
  }
  return 'development'
}

const getEnvValue = (value: string | undefined, fallback: string) => value ?? fallback

export default ({ config }: ConfigContext): ExpoConfig => {
  const apiUrl = getEnvValue(process.env.EXPO_PUBLIC_API_URL, 'http://localhost:8080/api')
  const socketUrl = getEnvValue(process.env.EXPO_PUBLIC_SOCKET_URL, 'http://localhost:8080')
  const environment = normalizeEnv(process.env.EXPO_PUBLIC_ENV)
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? ''
  const appName = config.name ?? 'mobile'
  const appSlug = config.slug ?? 'mobile'

  return {
    ...config,
    name: appName,
    slug: appSlug,
    extra: {
      ...(config.extra ?? {}),
      apiUrl,
      socketUrl,
      environment,
      sentryDsn,
    },
  }
}
