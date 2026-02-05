package com.lms.assignment.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeSubmissionRequest {
    @NotNull
    @Min(0)
    private Integer score;
    private String feedback;
}
