package com.lms.course.api;

import com.lms.course.domain.LessonType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateLessonRequest(
    @NotBlank(message = "Title is required") @Size(max = 255, message = "Title must not exceed 255 characters") String title,

    @NotNull(message = "Type is required") LessonType type,

    Integer durationMinutes,

    Integer sortOrder) {
}
