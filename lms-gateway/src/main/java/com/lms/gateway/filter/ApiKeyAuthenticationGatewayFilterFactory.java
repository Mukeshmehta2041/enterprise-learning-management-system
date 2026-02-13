package com.lms.gateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
public class ApiKeyAuthenticationGatewayFilterFactory
    extends AbstractGatewayFilterFactory<ApiKeyAuthenticationGatewayFilterFactory.Config> {

  private static final String HASH_PREFIX = "apikey:hash:";

  private final ReactiveStringRedisTemplate redisTemplate;
  private final ObjectMapper objectMapper;

  public ApiKeyAuthenticationGatewayFilterFactory(
      ReactiveStringRedisTemplate redisTemplate,
      ObjectMapper objectMapper) {
    super(Config.class);
    this.redisTemplate = redisTemplate;
    this.objectMapper = objectMapper;
  }

  @Data
  public static class Config {
    private boolean required = true;
    private List<String> requiredScopes;
    private List<String> applyMethods;
  }

  @Override
  public GatewayFilter apply(Config config) {
    return (exchange, chain) -> {
      ServerHttpRequest request = exchange.getRequest();

      if (!shouldApply(config, request)) {
        return chain.filter(exchange);
      }

      String apiKey = request.getHeaders().getFirst("X-API-Key");

      if (apiKey == null || apiKey.isBlank()) {
        if (!config.isRequired()) {
          return chain.filter(exchange);
        }
        return onError(exchange, "Missing API Key", HttpStatus.UNAUTHORIZED);
      }

      String hash = hashKey(apiKey);
      String redisKey = HASH_PREFIX + hash;

      return redisTemplate.opsForValue().get(redisKey)
          .flatMap(payload -> {
            ApiKeyRecord record = parseRecord(payload);
            if (record == null || !record.enabled) {
              return onError(exchange, "Invalid API Key", HttpStatus.UNAUTHORIZED);
            }
            if (record.expiresAt != null && record.expiresAt.isBefore(Instant.now())) {
              return onError(exchange, "API Key expired", HttpStatus.UNAUTHORIZED);
            }

            if (!hasRequiredScopes(record.scopes, config.getRequiredScopes())) {
              return onError(exchange, "Insufficient Scope", HttpStatus.FORBIDDEN);
            }

            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                .header("X-User-Id", record.userId)
                .header("X-API-Key-ID", record.id)
                .header("X-Roles", "API_CLIENT")
                .header("X-Authenticated-By", "API_KEY")
                .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
          })
          .switchIfEmpty(Mono.defer(() -> {
            if (!config.isRequired()) {
              return chain.filter(exchange);
            }
            return onError(exchange, "Invalid API Key", HttpStatus.UNAUTHORIZED);
          }));
    };
  }

  private boolean shouldApply(Config config, ServerHttpRequest request) {
    if (config.getApplyMethods() == null || config.getApplyMethods().isEmpty()) {
      return true;
    }
    String method = request.getMethod() != null ? request.getMethod().name() : "";
    return config.getApplyMethods().stream().anyMatch(m -> m.equalsIgnoreCase(method));
  }

  private boolean hasRequiredScopes(Set<String> scopes, List<String> requiredScopes) {
    if (requiredScopes == null || requiredScopes.isEmpty()) {
      return true;
    }
    if (scopes == null || scopes.isEmpty()) {
      return false;
    }
    return new HashSet<>(scopes).containsAll(requiredScopes);
  }

  private ApiKeyRecord parseRecord(String payload) {
    try {
      return objectMapper.readValue(payload, ApiKeyRecord.class);
    } catch (Exception ex) {
      log.warn("Failed to parse API key record", ex);
      return null;
    }
  }

  private String hashKey(String rawKey) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] encodedHash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
      return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(encodedHash);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Error hashing API key", e);
    }
  }

  private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
    log.warn("API key auth error: {} - {}", httpStatus, err);
    exchange.getResponse().setStatusCode(httpStatus);
    return exchange.getResponse().setComplete();
  }

  @Data
  @JsonIgnoreProperties(ignoreUnknown = true)
  private static class ApiKeyRecord {
    private String id;
    private String userId;
    private Set<String> scopes;
    private boolean enabled;
    private Instant expiresAt;
  }
}
