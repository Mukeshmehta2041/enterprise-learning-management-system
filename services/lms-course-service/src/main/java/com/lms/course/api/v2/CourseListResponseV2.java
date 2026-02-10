package com.lms.course.api.v2;

import java.util.List;

public record CourseListResponseV2(
    List<CourseResponseV2> data,
    PaginationMetadata metadata) {
}
