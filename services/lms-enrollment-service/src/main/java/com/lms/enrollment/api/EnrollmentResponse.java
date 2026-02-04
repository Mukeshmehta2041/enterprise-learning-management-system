package com.lms.enrollment.api;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EnrollmentResponse(
    UUID id,
    UUID userId,
    UUID courseId,
    String status,
    BigDecimal progressPct,
    Instant enrolledAt,
    Instant completedAt) {
}
