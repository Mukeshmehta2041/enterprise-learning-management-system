package com.lms.auth.application;

import com.lms.auth.config.RefreshTokenProperties;
import com.lms.auth.domain.RefreshTokenData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class RefreshTokenService {

  private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);
  private static final String REFRESH_TOKEN_PREFIX = "refresh:";

  private final RedisTemplate<String, RefreshTokenData> redisTemplate;
  private final RefreshTokenProperties refreshTokenProperties;

  public RefreshTokenService(
      @Qualifier("refreshTokenRedisTemplate") RedisTemplate<String, RefreshTokenData> redisTemplate,
      RefreshTokenProperties refreshTokenProperties) {
    this.redisTemplate = redisTemplate;
    this.refreshTokenProperties = refreshTokenProperties;
  }

  public String createRefreshToken(UUID userId, String email) {
    String tokenId = UUID.randomUUID().toString();
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(refreshTokenProperties.getTtlDays() * 24L * 60 * 60);

    RefreshTokenData tokenData = new RefreshTokenData(userId, email, now, expiresAt);

    String key = REFRESH_TOKEN_PREFIX + tokenId;
    redisTemplate.opsForValue().set(
        key,
        tokenData,
        refreshTokenProperties.getTtlDays(),
        TimeUnit.DAYS);

    log.debug("Created refresh token for user: {}", userId);
    return tokenId;
  }

  public RefreshTokenData getRefreshToken(String tokenId) {
    String key = REFRESH_TOKEN_PREFIX + tokenId;
    RefreshTokenData data = redisTemplate.opsForValue().get(key);

    if (data == null) {
      log.debug("Refresh token not found or expired: {}", tokenId);
      return null;
    }

    return data;
  }

  public void revokeRefreshToken(String tokenId) {
    String key = REFRESH_TOKEN_PREFIX + tokenId;
    Boolean deleted = redisTemplate.delete(key);
    log.debug("Revoked refresh token {}: {}", tokenId, deleted);
  }

  public String rotateRefreshToken(String oldTokenId, UUID userId, String email) {
    // Delete old token
    revokeRefreshToken(oldTokenId);

    // Create new token
    return createRefreshToken(userId, email);
  }
}
