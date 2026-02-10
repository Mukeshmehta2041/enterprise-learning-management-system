import { featureFlags, FeatureFlag } from '../utils/featureFlags';

export function useFeatureFlag(flag: FeatureFlag): boolean {
  // This could also listen to a global store if flags can change at runtime
  return featureFlags.isEnabled(flag);
}
