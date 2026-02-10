package com.lms.course.api.v2;

import java.util.UUID;
import java.util.List;

public record PaginationMetadata(
    long total,
    int page,
    int size,
    int totalPages,
    String nextCursor) {
}
