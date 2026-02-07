package com.lms.common.events;

import lombok.Builder;
import java.util.UUID;

/**
 * Event published when an enrollment occurs.
 */
@Builder
public record EnrollmentEvent(
    UUID enrollmentId,
    UUID userId,
    UUID courseId,
    String status,
    long timestamp) {
}
