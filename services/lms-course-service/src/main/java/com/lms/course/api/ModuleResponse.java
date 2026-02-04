package com.lms.course.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ModuleResponse(
    UUID id,
    String title,
    Integer sortOrder,
    List<LessonResponse> lessons,
    Instant createdAt,
    Instant updatedAt) {
}
