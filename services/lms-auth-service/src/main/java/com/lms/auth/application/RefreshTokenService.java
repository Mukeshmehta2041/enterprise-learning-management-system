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
  private static final String USER_TOKENS_PREFIX = "user:tokens:";

  private final RedisTemplate<String, RefreshTokenData> refreshTokenRedisTemplate;
  private final RedisTemplate<String, Object> redisTemplate;
  private final RefreshTokenProperties refreshTokenProperties;

  public RefreshTokenService(
      @Qualifier("refreshTokenRedisTemplate") RedisTemplate<String, RefreshTokenData> refreshTokenRedisTemplate,
      RedisTemplate<String, Object> redisTemplate,
      RefreshTokenProperties refreshTokenProperties) {
    this.refreshTokenRedisTemplate = refreshTokenRedisTemplate;
    this.redisTemplate = redisTemplate;
    this.refreshTokenProperties = refreshTokenProperties;
  }

  public String createRefreshToken(UUID userId, String email) {
    String tokenId = UUID.randomUUID().toString();
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(refreshTokenProperties.getTtlDays() * 24L * 60 * 60);

    RefreshTokenData tokenData = new RefreshTokenData(userId, email, now, expiresAt);

    String key = REFRESH_TOKEN_PREFIX + tokenId;
    refreshTokenRedisTemplate.opsForValue().set(
        key,
        tokenData,
        refreshTokenProperties.getTtlDays(),
        TimeUnit.DAYS);

    String userTokensKey = USER_TOKENS_PREFIX + userId;
    redisTemplate.opsForSet().add(userTokensKey, tokenId);
    redisTemplate.expire(userTokensKey, refreshTokenProperties.getTtlDays(), TimeUnit.DAYS);

    log.debug("Created refresh token for user: {}", userId);
    return tokenId;
  }

  public RefreshTokenData getRefreshToken(String tokenId) {
    String key = REFRESH_TOKEN_PREFIX + tokenId;
    RefreshTokenData data = refreshTokenRedisTemplate.opsForValue().get(key);

    if (data == null) {
      log.debug("Refresh token not found or expired: {}", tokenId);
      return null;
    }

    return data;
  }

  public void revokeRefreshToken(String tokenId) {
    String key = REFRESH_TOKEN_PREFIX + tokenId;
    RefreshTokenData data = refreshTokenRedisTemplate.opsForValue().get(key);
    if (data != null) {
      String userTokensKey = USER_TOKENS_PREFIX + data.getUserId();
      redisTemplate.opsForSet().remove(userTokensKey, tokenId);
    }
    Boolean deleted = redisTemplate.delete(key);
    log.debug("Revoked refresh token {}: {}", tokenId, deleted);
  }

  public void revokeAllForUser(UUID userId) {
    String userTokensKey = USER_TOKENS_PREFIX + userId;
    java.util.Set<Object> tokenIds = redisTemplate.opsForSet().members(userTokensKey);
    if (tokenIds != null) {
      for (Object tokenId : tokenIds) {
        refreshTokenRedisTemplate.delete(REFRESH_TOKEN_PREFIX + tokenId);
      }
    }
    redisTemplate.delete(userTokensKey);
    log.info("Revoked all refresh tokens for user: {}", userId);
  }

  public String rotateRefreshToken(String oldTokenId, UUID userId, String email) {
    // Delete old token
    revokeRefreshToken(oldTokenId);

    // Create new token
    return createRefreshToken(userId, email);
  }
}
