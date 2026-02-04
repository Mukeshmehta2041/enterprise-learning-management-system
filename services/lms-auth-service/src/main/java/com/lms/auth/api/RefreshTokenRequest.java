package com.lms.auth.api;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
    @NotBlank(message = "Grant type is required") String grant_type,

    @NotBlank(message = "Refresh token is required") String refresh_token) {
}
