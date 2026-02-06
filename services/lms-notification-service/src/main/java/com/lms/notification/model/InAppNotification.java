package com.lms.notification.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InAppNotification {
  private String id;
  private String userId;
  private String type;
  private String title;
  private String message;
  private Boolean read;
  private Instant createdAt;
  private Instant readAt;
}
