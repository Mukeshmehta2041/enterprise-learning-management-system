package com.lms.user.api;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 255)
        String displayName,

        @Size(max = 500)
        String avatarUrl
) {}
