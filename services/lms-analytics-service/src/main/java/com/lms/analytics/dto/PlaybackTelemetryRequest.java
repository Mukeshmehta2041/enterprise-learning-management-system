package com.lms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaybackTelemetryRequest {
  private UUID lessonId;
  private UUID courseId;
  private UUID userId;
  private PlaybackEventType eventType;
  private Double positionSecs;
  private String errorCode;
  private String errorMessage;
  private Long timestamp;

  public enum PlaybackEventType {
    PLAY, PAUSE, SEEK, COMPLETE, ERROR, HEARTBEAT
  }
}
