package com.lms.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDeletedEvent {
  private UUID userId;
  private long timestamp;
  private boolean hardDelete; // true if data should be purged, false for anonymization
}
