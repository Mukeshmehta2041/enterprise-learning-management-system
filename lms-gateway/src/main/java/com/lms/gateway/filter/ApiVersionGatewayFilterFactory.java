package com.lms.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ApiVersionGatewayFilterFactory
    extends AbstractGatewayFilterFactory<ApiVersionGatewayFilterFactory.Config> {

  public static final String X_API_VERSION = "X-API-Version";

  public ApiVersionGatewayFilterFactory() {
    super(Config.class);
  }

  @Override
  public List<String> shortcutFieldOrder() {
    return Collections.singletonList("defaultVersion");
  }

  @Override
  public GatewayFilter apply(Config config) {
    return (exchange, chain) -> {
      ServerHttpRequest request = exchange.getRequest();

      if (!request.getHeaders().containsKey(X_API_VERSION)) {
        ServerHttpRequest modifiedRequest = request.mutate()
            .header(X_API_VERSION, config.getDefaultVersion())
            .build();
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
      }

      return chain.filter(exchange);
    };
  }

  public static class Config {
    private String defaultVersion = "1.0.0";

    public String getDefaultVersion() {
      return defaultVersion;
    }

    public void setDefaultVersion(String defaultVersion) {
      this.defaultVersion = defaultVersion;
    }
  }
}
