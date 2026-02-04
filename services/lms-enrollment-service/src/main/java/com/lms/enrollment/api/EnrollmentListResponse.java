package com.lms.enrollment.api;

import java.util.List;

public record EnrollmentListResponse(
    List<EnrollmentResponse> items,
    String nextCursor) {
}
