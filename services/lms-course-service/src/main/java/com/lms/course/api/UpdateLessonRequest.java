package com.lms.course.api;

import com.lms.course.domain.LessonType;

public record UpdateLessonRequest(
    String title,
    LessonType type,
    Integer durationMinutes,
    Integer sortOrder,
    Boolean isPreview,
    String status) {
}
