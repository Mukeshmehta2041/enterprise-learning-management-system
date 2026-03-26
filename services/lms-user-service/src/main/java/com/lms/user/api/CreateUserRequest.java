package com.lms.user.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "email is required")
        @Email
        @Size(max = 255)
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 8, max = 100)
        String password,

        @Size(max = 255)
        String displayName,

        @Size(max = 100)
        String role
) {}
