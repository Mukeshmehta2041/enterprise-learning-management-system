package com.lms.enrollment.api;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record EnrollmentResponse(
    UUID id,
    UUID courseId,
    String courseTitle,
    String courseThumbnailUrl,
    UUID userId,
    String status,
    BigDecimal progressPct,
    List<UUID> completedLessonIds,
    Map<UUID, Integer> lessonPositions,
    UUID lastLessonId,
    Instant enrolledAt,
    Instant completedAt,
    Instant lastAccessedAt) {
}
