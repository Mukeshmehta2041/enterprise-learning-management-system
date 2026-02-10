package com.lms.enrollment.api.v2;

import java.util.List;

public record EnrollmentListResponseV2(
    List<EnrollmentResponseV2> enrollments,
    String nextCursor,
    long total) {
}
