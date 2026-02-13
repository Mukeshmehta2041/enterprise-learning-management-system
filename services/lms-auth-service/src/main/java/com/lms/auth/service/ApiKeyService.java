package com.lms.auth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

  private static final String PREFIX = "lms_";
  private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private static final int KEY_LENGTH = 32;
  private static final String HASH_PREFIX = "apikey:hash:";
  private static final String ID_PREFIX = "apikey:id:";
  private static final String USER_PREFIX = "apikey:user:";
  private static final Set<String> ALLOWED_SCOPES = Set.of(
      "courses:read",
      "enrollments:write",
      "analytics:read");

  private final SecureRandom random = new SecureRandom();
  private final StringRedisTemplate stringRedisTemplate;
  private final ObjectMapper objectMapper;

  public ApiKeyCreateResponse createApiKey(UUID userId, String name, Set<String> scopes) {
    if (name == null || name.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "API key name is required");
    }
    if (scopes == null || scopes.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one scope is required");
    }
    if (!ALLOWED_SCOPES.containsAll(scopes)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid scopes requested");
    }

    String rawKey = generateRawKey();
    String hash = hashKey(rawKey);
    UUID id = UUID.randomUUID();
    Instant now = Instant.now();

    ApiKeyRecord record = ApiKeyRecord.builder()
        .id(id)
        .name(name)
        .userId(userId)
        .keyHash(hash)
        .scopes(scopes)
        .enabled(true)
        .createdAt(now)
        .updatedAt(now)
        .build();

    saveRecord(record);
    stringRedisTemplate.opsForSet().add(USER_PREFIX + userId, id.toString());

    return ApiKeyCreateResponse.builder()
        .id(record.getId())
        .name(record.getName())
        .rawKey(rawKey)
        .scopes(record.getScopes())
        .createdAt(record.getCreatedAt())
        .build();
  }

  public List<ApiKeySummary> getUserApiKeys(UUID userId) {
    Set<String> ids = stringRedisTemplate.opsForSet().members(USER_PREFIX + userId);
    if (ids == null || ids.isEmpty()) {
      return List.of();
    }

    List<ApiKeySummary> results = new ArrayList<>();
    for (String id : ids) {
      ApiKeyRecord record = getRecordById(id);
      if (record != null) {
        results.add(toSummary(record));
      }
    }

    results.sort(Comparator.comparing(ApiKeySummary::getCreatedAt).reversed());
    return results;
  }

  public void revokeApiKey(UUID id, UUID userId) {
    ApiKeyRecord record = getRecordById(id.toString());
    if (record == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "API key not found");
    }
    if (!record.getUserId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
    }

    stringRedisTemplate.delete(ID_PREFIX + record.getId());
    stringRedisTemplate.delete(HASH_PREFIX + record.getKeyHash());
    stringRedisTemplate.opsForSet().remove(USER_PREFIX + userId, record.getId().toString());
  }

  public Optional<ApiKeyValidation> validateKey(String rawKey) {
    if (rawKey == null || rawKey.isBlank()) {
      return Optional.empty();
    }

    String hash = hashKey(rawKey);
    ApiKeyRecord record = getRecordByHash(hash);
    if (record == null) {
      return Optional.empty();
    }
    if (!record.isEnabled()) {
      return Optional.empty();
    }
    if (record.getExpiresAt() != null && record.getExpiresAt().isBefore(Instant.now())) {
      return Optional.empty();
    }

    record.setLastUsedAt(Instant.now());
    record.setUpdatedAt(Instant.now());
    saveRecord(record);

    return Optional.of(ApiKeyValidation.builder()
        .id(record.getId())
        .userId(record.getUserId())
        .scopes(record.getScopes())
        .expiresAt(record.getExpiresAt())
        .build());
  }

  private void saveRecord(ApiKeyRecord record) {
    String payload = toJson(record);
    String idKey = ID_PREFIX + record.getId();
    String hashKey = HASH_PREFIX + record.getKeyHash();

    Duration ttl = null;
    if (record.getExpiresAt() != null) {
      ttl = Duration.between(Instant.now(), record.getExpiresAt());
      if (ttl.isNegative()) {
        ttl = Duration.ZERO;
      }
    }

    if (ttl == null) {
      stringRedisTemplate.opsForValue().set(idKey, payload);
      stringRedisTemplate.opsForValue().set(hashKey, payload);
    } else {
      stringRedisTemplate.opsForValue().set(idKey, payload, ttl);
      stringRedisTemplate.opsForValue().set(hashKey, payload, ttl);
    }
  }

  private ApiKeyRecord getRecordById(String id) {
    String payload = stringRedisTemplate.opsForValue().get(ID_PREFIX + id);
    return payload == null ? null : fromJson(payload);
  }

  private ApiKeyRecord getRecordByHash(String hash) {
    String payload = stringRedisTemplate.opsForValue().get(HASH_PREFIX + hash);
    return payload == null ? null : fromJson(payload);
  }

  private String generateRawKey() {
    StringBuilder sb = new StringBuilder(PREFIX);
    for (int i = 0; i < KEY_LENGTH; i++) {
      sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
    }
    return sb.toString();
  }

  private String hashKey(String rawKey) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] encodedHash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(encodedHash);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Error hashing API key", e);
    }
  }

  private String toJson(ApiKeyRecord record) {
    try {
      return objectMapper.writeValueAsString(record);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error serializing API key", e);
    }
  }

  private ApiKeyRecord fromJson(String payload) {
    try {
      return objectMapper.readValue(payload, ApiKeyRecord.class);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error parsing API key", e);
    }
  }

  private ApiKeySummary toSummary(ApiKeyRecord record) {
    return ApiKeySummary.builder()
        .id(record.getId())
        .name(record.getName())
        .scopes(record.getScopes())
        .enabled(record.isEnabled())
        .createdAt(record.getCreatedAt())
        .lastUsedAt(record.getLastUsedAt())
        .expiresAt(record.getExpiresAt())
        .build();
  }

  @Value
  @Builder
  public static class ApiKeyCreateResponse {
    UUID id;
    String name;
    String rawKey;
    Set<String> scopes;
    Instant createdAt;
  }

  @Value
  @Builder
  public static class ApiKeySummary {
    UUID id;
    String name;
    Set<String> scopes;
    boolean enabled;
    Instant createdAt;
    Instant lastUsedAt;
    Instant expiresAt;
  }

  @Value
  @Builder
  public static class ApiKeyValidation {
    UUID id;
    UUID userId;
    Set<String> scopes;
    Instant expiresAt;
  }

  @Builder
  @lombok.Data
  public static class ApiKeyRecord {
    private UUID id;
    private String name;
    private UUID userId;
    private String keyHash;
    private Set<String> scopes;
    private boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastUsedAt;
    private Instant expiresAt;
  }
}
