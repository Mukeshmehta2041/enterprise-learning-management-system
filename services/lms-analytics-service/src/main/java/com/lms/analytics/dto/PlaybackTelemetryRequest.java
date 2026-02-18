package com.lms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaybackTelemetryRequest {
  private UUID contentId;
  private UUID lessonId;
  private UUID courseId;
  private UUID userId;
  private PlaybackEventType eventType;
  private Double positionSecs;
  private Double totalDurationSecs;
  private Map<String, Object> metadata;
  private String errorCode;
  private String errorMessage;
  private Long timestamp;

  public enum PlaybackEventType {
    PLAY, PAUSE, SEEK, COMPLETE, ERROR, HEARTBEAT
  }
}
