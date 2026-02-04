package com.lms.enrollment.api;

public record ErrorResponse(
    int status,
    String error,
    String message) {
}
