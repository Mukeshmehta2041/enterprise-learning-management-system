package com.lms.notification.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {
  @Id
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "course_id")
  private UUID courseId;

  @Column(name = "event_type", nullable = false)
  private String eventType;

  @Column(name = "channel", nullable = false)
  @Enumerated(EnumType.STRING)
  private NotificationChannel channel;

  @Column(nullable = false)
  private boolean enabled;

  @Column(name = "updated_at")
  private Instant updatedAt;

  public enum NotificationChannel {
    EMAIL, IN_APP, PUSH
  }
}
