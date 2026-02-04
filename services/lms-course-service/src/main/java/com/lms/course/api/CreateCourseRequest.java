package com.lms.course.api;

import com.lms.course.domain.CourseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCourseRequest(
    @NotBlank(message = "Title is required") @Size(max = 255, message = "Title must not exceed 255 characters") String title,

    @Size(max = 255, message = "Slug must not exceed 255 characters") String slug,

    String description,

    CourseStatus status) {
}
