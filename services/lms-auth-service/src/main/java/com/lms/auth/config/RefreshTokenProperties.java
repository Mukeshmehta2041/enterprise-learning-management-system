package com.lms.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "refresh-token")
public class RefreshTokenProperties {

  private int ttlDays;

  public int getTtlDays() {
    return ttlDays;
  }

  public void setTtlDays(int ttlDays) {
    this.ttlDays = ttlDays;
  }
}
