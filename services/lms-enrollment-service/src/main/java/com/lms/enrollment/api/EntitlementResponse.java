package com.lms.enrollment.api;

import java.util.UUID;

public record EntitlementResponse(
    UUID userId,
    UUID courseId,
    AccessLevel accessLevel,
    boolean isEnrolled,
    String reason) {
  public enum AccessLevel {
    NONE,
    PREVIEW,
    FULL
  }
}
