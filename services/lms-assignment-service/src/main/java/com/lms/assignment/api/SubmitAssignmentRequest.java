package com.lms.assignment.api;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubmitAssignmentRequest {
    @NotBlank
    private String content;
}
