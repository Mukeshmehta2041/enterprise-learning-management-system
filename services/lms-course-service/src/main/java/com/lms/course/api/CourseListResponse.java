package com.lms.course.api;

import java.util.List;

public record CourseListResponse(
    List<CourseResponse> content,
    String nextCursor,
    long totalElements,
    int totalPages,
    int size,
    int number) {
}
