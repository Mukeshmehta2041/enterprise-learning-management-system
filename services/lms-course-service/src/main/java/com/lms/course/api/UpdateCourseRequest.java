package com.lms.course.api;

import com.lms.course.domain.CourseStatus;
import java.math.BigDecimal;

public record UpdateCourseRequest(
    String title,
    String description,
    String category,
    String level,
    BigDecimal price,
    CourseStatus status) {
}
