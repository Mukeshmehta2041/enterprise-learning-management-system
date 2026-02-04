package com.lms.course.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CourseDetailResponse(
    UUID id,
    String title,
    String slug,
    String description,
    String status,
    List<ModuleResponse> modules,
    List<UUID> instructorIds,
    Instant createdAt,
    Instant updatedAt) {
}
