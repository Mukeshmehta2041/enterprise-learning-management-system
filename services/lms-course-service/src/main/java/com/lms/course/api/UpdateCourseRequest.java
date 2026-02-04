package com.lms.course.api;

import com.lms.course.domain.CourseStatus;

public record UpdateCourseRequest(
    String title,
    String description,
    CourseStatus status) {
}
