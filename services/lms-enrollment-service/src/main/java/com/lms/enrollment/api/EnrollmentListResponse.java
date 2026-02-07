package com.lms.enrollment.api;

import java.util.List;

public record EnrollmentListResponse(
    List<EnrollmentResponse> content,
    String nextCursor,
    long totalElements,
    int totalPages) {
}
