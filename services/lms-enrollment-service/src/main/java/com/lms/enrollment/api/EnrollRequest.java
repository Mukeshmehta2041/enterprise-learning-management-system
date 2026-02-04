package com.lms.enrollment.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EnrollRequest(
    @NotNull(message = "Course ID is required") UUID courseId) {
}
