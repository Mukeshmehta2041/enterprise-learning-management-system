package com.lms.user.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssignRoleRequest(
        @NotBlank(message = "role is required")
        @Size(max = 100)
        String role
) {}
