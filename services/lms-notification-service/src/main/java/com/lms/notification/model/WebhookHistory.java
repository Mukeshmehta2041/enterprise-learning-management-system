package com.lms.notification.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "webhook_history", schema = "lms_notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookHistory {

  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "subscription_id")
  private WebhookSubscription subscription;

  @Column(name = "event_id")
  private String eventId;

  @Column(name = "event_type")
  private String eventType;

  @Column(columnDefinition = "TEXT")
  private String payload;

  @Column(name = "response_code")
  private Integer responseCode;

  @Column(name = "response_body", columnDefinition = "TEXT")
  private String responseBody;

  @Column(name = "sent_at")
  private Instant sentAt;

  @Column(name = "duration_ms")
  private Long durationMs;

  @Column(nullable = false)
  private boolean success;
}
