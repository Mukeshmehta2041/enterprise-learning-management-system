package com.lms.enrollment.api;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EnrollmentResponse(
    UUID id,
    UUID courseId,
    String courseTitle,
    String courseThumbnailUrl,
    UUID userId,
    String status,
    BigDecimal progressPct,
    Instant enrolledAt,
    Instant completedAt,
    Instant lastAccessedAt) {
}
