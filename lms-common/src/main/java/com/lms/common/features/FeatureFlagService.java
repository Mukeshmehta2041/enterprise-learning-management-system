package com.lms.common.features;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeatureFlagService {

  private final StringRedisTemplate redisTemplate;
  private final FeatureFlagProperties properties;

  private static final String REDIS_PREFIX = "feature-flag:";

  /**
   * Checks if a feature is enabled.
   * Order of precedence:
   * 1. Redis override (for hot-toggling without restart)
   * 2. Application properties (static configuration)
   * 3. Default (false)
   */
  public boolean isEnabled(String featureName) {
    // 1. Check Redis
    String redisKey = REDIS_PREFIX + featureName;
    String redisValue = redisTemplate.opsForValue().get(redisKey);

    if (redisValue != null) {
      return Boolean.parseBoolean(redisValue);
    }

    // 2. Check Static Properties
    return properties.getFlags().getOrDefault(featureName, false);
  }

  public void setOverride(String featureName, boolean enabled) {
    log.info("Setting override for feature '{}' to {}", featureName, enabled);
    redisTemplate.opsForValue().set(REDIS_PREFIX + featureName, String.valueOf(enabled));
  }

  public void removeOverride(String featureName) {
    log.info("Removing override for feature '{}'", featureName);
    redisTemplate.delete(REDIS_PREFIX + featureName);
  }
}
