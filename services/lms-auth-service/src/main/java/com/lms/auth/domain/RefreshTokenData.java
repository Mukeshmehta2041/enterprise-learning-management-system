package com.lms.auth.domain;

import java.time.Instant;
import java.util.UUID;

public class RefreshTokenData {
  private UUID userId;
  private String email;
  private Instant createdAt;
  private Instant expiresAt;

  public RefreshTokenData() {
  }

  public RefreshTokenData(UUID userId, String email, Instant createdAt, Instant expiresAt) {
    this.userId = userId;
    this.email = email;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }
}
