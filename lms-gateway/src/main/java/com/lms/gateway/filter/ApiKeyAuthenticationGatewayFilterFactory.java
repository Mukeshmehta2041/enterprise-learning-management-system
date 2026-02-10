package com.lms.gateway.filter;

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

import java.util.List;

@Slf4j
@Component
public class ApiKeyAuthenticationGatewayFilterFactory
    extends AbstractGatewayFilterFactory<ApiKeyAuthenticationGatewayFilterFactory.Config> {

  private final ReactiveStringRedisTemplate redisTemplate;

  public ApiKeyAuthenticationGatewayFilterFactory(ReactiveStringRedisTemplate redisTemplate) {
    super(Config.class);
    this.redisTemplate = redisTemplate;
  }

  @Data
  public static class Config {
    private boolean required = true;
    private List<String> requiredScopes;
  }

  @Override
  public GatewayFilter apply(Config config) {
    return (exchange, chain) -> {
      ServerHttpRequest request = exchange.getRequest();
      String apiKey = request.getHeaders().getFirst("X-API-Key");

      if (apiKey == null || apiKey.isBlank()) {
        if (!config.isRequired()) {
          return chain.filter(exchange);
        }
        return onError(exchange, "Missing API Key", HttpStatus.UNAUTHORIZED);
      }

      // In a real system, we would hash the key and look it up in Redis or DB
      // Redis key: "apikey:hash:<hash_of_key>"
      // Value: JSON with { "userId": "...", "scopes": ["...", "..."] }

      String internalKey = "apikey:val:" + apiKey; // Simplified for demo; should be hashed!

      return redisTemplate.opsForValue().get(internalKey)
          .flatMap(data -> {
            // Assume data is a comma-separated string: "userId;scope1,scope2"
            String[] parts = data.split(";");
            String userId = parts[0];
            String scopes = parts.length > 1 ? parts[1] : "";

            // Check scopes if required
            if (config.getRequiredScopes() != null) {
              for (String requiredScope : config.getRequiredScopes()) {
                if (!scopes.contains(requiredScope)) {
                  return onError(exchange, "Insufficient Scope", HttpStatus.FORBIDDEN);
                }
              }
            }

            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                .header("X-User-Id", userId)
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

  private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
    exchange.getResponse().setStatusCode(httpStatus);
    return exchange.getResponse().setComplete();
  }
}
