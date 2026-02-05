package com.lms.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainEvent {
  private String eventType;
  private String aggregateId;
  private String aggregateType;
  private Instant occurredAt;
  private Map<String, Object> payload;
}
