package com.lms.course.api;

public record UpdateModuleRequest(
    String title,
    Integer sortOrder) {
}
