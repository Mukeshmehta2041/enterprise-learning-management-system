package com.lms.course.api;

import java.time.Instant;
import java.util.UUID;

public record LessonResponse(
    UUID id,
    String title,
    String type,
    Integer durationMinutes,
    Integer sortOrder,
    Boolean isPreview,
    Boolean canWatch,
    String status,
    Instant createdAt,
    Instant updatedAt) {
}
