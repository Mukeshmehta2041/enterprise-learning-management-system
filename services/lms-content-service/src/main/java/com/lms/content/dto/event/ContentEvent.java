package com.lms.content.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentEvent {
  private UUID eventId;
  private String eventType; // ContentPublished, ContentUpdated, itc.
  private UUID contentItemId;
  private UUID courseId;
  private String title;
  private String contentType;
  private String storagePath;
  private OffsetDateTime timestamp;
}
