package com.lms.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

  private String secret;
  private int accessTokenExpiryMinutes;
  private String issuer;

  public String getSecret() {
    return secret;
  }

  public void setSecret(String secret) {
    this.secret = secret;
  }

  public int getAccessTokenExpiryMinutes() {
    return accessTokenExpiryMinutes;
  }

  public void setAccessTokenExpiryMinutes(int accessTokenExpiryMinutes) {
    this.accessTokenExpiryMinutes = accessTokenExpiryMinutes;
  }

  public String getIssuer() {
    return issuer;
  }

  public void setIssuer(String issuer) {
    this.issuer = issuer;
  }
}
