package com.lms.enrollment.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateProgressRequest(
    @NotNull(message = "Lesson ID is required") UUID lessonId,
    @NotNull(message = "Completed status is required") Boolean completed,
    Double positionSecs) {
}
