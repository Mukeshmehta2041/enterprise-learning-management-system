package com.lms.course.api;

import com.lms.course.domain.CourseStatus;
import java.math.BigDecimal;

public record UpdateCourseRequest(
    String title,
    String description,
    String category,
    String level,
    BigDecimal price,
    String currency,
    Boolean isFree,
    BigDecimal completionThreshold,
    Boolean requireAllAssignments,
    String thumbnailUrl,
    CourseStatus status) {
}
