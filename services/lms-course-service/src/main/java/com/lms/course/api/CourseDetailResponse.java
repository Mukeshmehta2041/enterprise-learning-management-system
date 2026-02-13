package com.lms.course.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CourseDetailResponse(
    UUID id,
    String title,
    String slug,
    String description,
    String category,
    String level,
    java.math.BigDecimal price,
    String currency,
    Boolean isFree,
    String thumbnailUrl,
    String status,
    Boolean isFeatured,
    Boolean isTrending,
    java.math.BigDecimal completionThreshold,
    Boolean requireAllAssignments,
    java.util.Set<String> tags,
    List<ModuleResponse> modules,
    List<UUID> instructorIds,
    Instant createdAt,
    Instant updatedAt) {
}
