package com.lms.notification.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "webhook_subscriptions", schema = "lms_notification")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookSubscription {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "event_type", nullable = false)
  private String eventType;

  @Column(name = "target_url", nullable = false, columnDefinition = "TEXT")
  private String targetUrl;

  @Column(name = "secret", nullable = false)
  private String secret;

  @Builder.Default
  @Column(name = "active", nullable = false)
  private boolean active = true;

  @Column(name = "created_by")
  private String createdBy;

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private Instant updatedAt;
}
