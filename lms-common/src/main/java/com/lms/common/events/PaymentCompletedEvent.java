package com.lms.common.events;

import java.math.BigDecimal;
import lombok.Builder;
import java.util.UUID;

@Builder
public record PaymentCompletedEvent(
    UUID userId,
    UUID courseId,
    Long planId,
    BigDecimal amount) {
}
