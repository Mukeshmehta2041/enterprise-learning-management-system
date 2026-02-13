package com.lms.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationGatewayFilterFactory
    extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

  private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationGatewayFilterFactory.class);

  private final SecretKey key;
  private final ReactiveStringRedisTemplate redisTemplate;

  public JwtAuthenticationGatewayFilterFactory(@Value("${lms.jwt.secret}") String secret,
      ReactiveStringRedisTemplate redisTemplate) {
    super(Config.class);
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.redisTemplate = redisTemplate;
  }

  @Override
  public GatewayFilter apply(Config config) {
    return (exchange, chain) -> {
      ServerHttpRequest request = exchange.getRequest();
      String authenticatedBy = request.getHeaders().getFirst("X-Authenticated-By");
      if ("API_KEY".equalsIgnoreCase(authenticatedBy)) {
        return chain.filter(exchange);
      }
      String path = request.getURI().getPath();

      // Skip authentication for Swagger/OpenAPI endpoints
      if (path.contains("/v3/api-docs") || path.contains("/swagger-ui")) {
        return chain.filter(exchange);
      }

      String token = null;
      if (request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      } else if (request.getQueryParams().containsKey("token")) {
        token = request.getQueryParams().getFirst("token");
      }

      if (token == null) {
        if (!config.isRequired()) {
          return chain.filter(exchange);
        }
        return onError(exchange, "Missing Authentication Token", HttpStatus.UNAUTHORIZED);
      }

      return validateToken(token)
          .flatMap(claims -> {
            String jti = claims.getId();
            // Check if token is revoked in Redis
            return redisTemplate.hasKey("jwt:revoked:" + jti)
                .flatMap(isRevoked -> {
                  if (isRevoked) {
                    if (!config.isRequired()) {
                      return chain.filter(exchange);
                    }
                    return onError(exchange, "Token is revoked", HttpStatus.UNAUTHORIZED);
                  }

                  // Forward headers
                  String userId = claims.getSubject();
                  List<String> roles = claims.get("roles", List.class);
                  String rolesStr = roles != null ? String.join(",", roles) : "";

                  ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                      .header("X-User-Id", userId)
                      .header("X-Roles", rolesStr)
                      .headers(httpHeaders -> httpHeaders.remove(HttpHeaders.AUTHORIZATION)) // Strip Authorization
                                                                                             // header
                      .build();

                  return chain.filter(exchange.mutate().request(modifiedRequest).build());
                });
          })
          .onErrorResume(e -> {
            log.error("JWT Validation failed: {}", e.getMessage());
            if (!config.isRequired()) {
              return chain.filter(exchange);
            }
            return onError(exchange, "Token validation failed", HttpStatus.UNAUTHORIZED);
          });
    };
  }

  private Mono<Claims> validateToken(String token) {
    try {
      Claims claims = Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(token)
          .getPayload();
      return Mono.just(claims);
    } catch (Exception e) {
      return Mono.error(e);
    }
  }

  private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
    log.warn("Authentication error: {} - {}", status, message);
    exchange.getResponse().setStatusCode(status);
    return exchange.getResponse().setComplete();
  }

  public static class Config {
    private boolean required = true;

    public boolean isRequired() {
      return required;
    }

    public void setRequired(boolean required) {
      this.required = required;
    }
  }
}
