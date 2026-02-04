package com.lms.course.api;

import java.util.List;

public record CourseListResponse(
    List<CourseResponse> items,
    String nextCursor) {
}
