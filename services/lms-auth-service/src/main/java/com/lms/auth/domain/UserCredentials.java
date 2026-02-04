package com.lms.auth.domain;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class UserCredentials {
  private UUID userId;
  private String email;
  private String passwordHash;
  private String status;
  private Set<String> roles;
  private Instant createdAt;

  public UserCredentials() {
  }

  public UserCredentials(UUID userId, String email, String passwordHash, String status, Set<String> roles) {
    this.userId = userId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.status = status;
    this.roles = roles;
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

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
