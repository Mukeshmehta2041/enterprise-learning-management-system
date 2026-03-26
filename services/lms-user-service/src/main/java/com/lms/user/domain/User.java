package com.lms.user.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users", schema = "lms_user")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class User {

  @Id
  @Column(name = "id", updatable = false, nullable = false)
  private UUID id;

  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  @Column(name = "password_hash", nullable = false, length = 255)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 50)
  private UserStatus status = UserStatus.ACTIVE;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Profile profile;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private Set<UserRole> roles = new HashSet<>();

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected User() {
  }

  public User(UUID id, String email, String passwordHash, UserStatus status) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.status = status != null ? status : UserStatus.ACTIVE;
  }

  public String getDisplayName() {
    return profile != null ? profile.getDisplayName() : null;
  }
}
