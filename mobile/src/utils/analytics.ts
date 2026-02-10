import { Platform } from 'react-native'

type EventName =
  | 'app_opened'
  | 'login_success'
  | 'login_failed'
  | 'course_viewed'
  | 'lesson_completed'
  | 'assignment_submitted'
  | 'enroll_clicked'
  | 'enrollment_success'
  | 'payment_started'
  | 'payment_completed'
  | 'notification_received'
  | 'screen_view'
  | 'api_latency'
  | 'app_crash'
  | 'performance_metric'

interface EventParams {
  [key: string]: string | number | boolean | null | undefined
}

class AnalyticsService {
  private isDev = __DEV__

  async init() {
    if (this.isDev) {
      console.log('[Analytics] Initialized (Dev Mode)')
    }
  }

  async trackPerformance(metricName: string, value: number, params: EventParams = {}) {
    await this.track('performance_metric', {
      metric_name: metricName,
      value: value,
      ...params,
    })
  }

  async trackApiLatency(endpoint: string, method: string, durationMs: number) {
    await this.track('api_latency', {
      endpoint,
      method,
      duration_ms: durationMs,
    })
  }

  async setUser(userId: string, traits: Record<string, any> = {}) {
    if (this.isDev) {
      console.log(`[Analytics] Set User: ${userId}`, traits)
    }
    // Integration point for Segment/Firebase:
    // firebase.analytics().setUserId(userId);
    // firebase.analytics().setUserProperties(traits);
  }

  async track(event: EventName, params: EventParams = {}) {
    const defaultParams = {
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    }

    const finalParams = { ...defaultParams, ...params }

    if (this.isDev) {
      console.log(`[Analytics] Track Event: ${event}`, finalParams)
    }

    // Integration point:
    // firebase.analytics().logEvent(event, finalParams);
  }

  async trackScreen(screenName: string, params: EventParams = {}) {
    if (this.isDev) {
      console.log(`[Analytics] Track Screen: ${screenName}`, params)
    }

    // Integration point:
    // firebase.analytics().logScreenView({ screen_name: screenName, ...params });
  }

  async reset() {
    if (this.isDev) {
      console.log('[Analytics] Reset Identity')
    }
    // Integration point:
    // firebase.analytics().resetAnalyticsData();
  }
}

export const analytics = new AnalyticsService()
