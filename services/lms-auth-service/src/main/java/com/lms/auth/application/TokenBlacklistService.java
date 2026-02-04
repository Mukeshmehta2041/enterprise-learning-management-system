package com.lms.auth.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

  private static final Logger log = LoggerFactory.getLogger(TokenBlacklistService.class);
  private static final String BLACKLIST_PREFIX = "jwt:revoked:";

  private final RedisTemplate<String, Object> redisTemplate;

  public TokenBlacklistService(RedisTemplate<String, Object> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  public void blacklistToken(String jti, Instant expiresAt) {
    String key = BLACKLIST_PREFIX + jti;
    long ttlSeconds = expiresAt.getEpochSecond() - Instant.now().getEpochSecond();

    if (ttlSeconds <= 0) {
      log.debug("Token already expired, not adding to blacklist: {}", jti);
      return;
    }

    // Store with TTL equal to remaining token lifetime
    redisTemplate.opsForValue().set(key, true, ttlSeconds, TimeUnit.SECONDS);
    log.debug("Blacklisted token {} for {} seconds", jti, ttlSeconds);
  }

  public boolean isBlacklisted(String jti) {
    String key = BLACKLIST_PREFIX + jti;
    Boolean exists = redisTemplate.hasKey(key);
    return Boolean.TRUE.equals(exists);
  }
}
