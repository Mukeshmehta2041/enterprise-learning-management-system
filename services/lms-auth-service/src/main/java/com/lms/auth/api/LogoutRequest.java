package com.lms.auth.api;

public record LogoutRequest(
    String refresh_token) {
}
