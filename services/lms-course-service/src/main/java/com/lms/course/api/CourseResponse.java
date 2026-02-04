package com.lms.course.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CourseResponse(
    UUID id,
    String title,
    String slug,
    String description,
    String status,
    List<UUID> instructorIds,
    Instant createdAt,
    Instant updatedAt) {
}
