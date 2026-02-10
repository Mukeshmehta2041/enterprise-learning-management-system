package com.lms.course.api.v2;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

public record CourseResponseV2(
    UUID id,
    String title,
    String slug,
    String description,
    String category,
    String level,
    BigDecimal price,
    String status,
    List<UUID> instructorIds,
    Double avgRating,
    Integer enrollmentCount,
    Instant createdAt,
    Instant updatedAt) {
}
