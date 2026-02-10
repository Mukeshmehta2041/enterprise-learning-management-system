package com.lms.enrollment.api.v2;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EnrollmentResponseV2(
    UUID id,
    UUID courseId,
    String courseTitle,
    String courseThumbnailUrl,
    UUID userId,
    String status,
    BigDecimal progressPct,
    UUID nextLessonId, // New in V2
    String nextLessonTitle, // New in V2
    Instant enrolledAt,
    Instant completedAt,
    Instant lastAccessedAt) {
}
