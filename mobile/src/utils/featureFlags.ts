export type FeatureFlag =
  | 'new_course_card'
  | 'chat_v2'
  | 'advanced_analytics'
  | 'profile_v2';

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  'new_course_card': true,
  'chat_v2': false,
  'advanced_analytics': __DEV__,
  'profile_v2': false,
};

class FeatureFlagService {
  private flags: Record<FeatureFlag, boolean> = { ...DEFAULT_FLAGS };

  async init() {
    // In production, fetch from Remote Config (Firebase/LaunchDarkly)
    // const remoteFlags = await fetchRemoteFlags();
    // this.flags = { ...this.flags, ...remoteFlags };
    if (__DEV__) {
      console.log('[FeatureFlag] Initialized with', this.flags);
    }
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags[flag] || false;
  }

  setOverride(flag: FeatureFlag, value: boolean) {
    this.flags[flag] = value;
  }
}

export const featureFlags = new FeatureFlagService();
