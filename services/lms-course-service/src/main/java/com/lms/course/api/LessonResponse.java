package com.lms.course.api;

import java.time.Instant;
import java.util.UUID;

public record LessonResponse(
    UUID id,
    String title,
    String type,
    Integer durationMinutes,
    Integer sortOrder,
    Instant createdAt,
    Instant updatedAt) {
}
