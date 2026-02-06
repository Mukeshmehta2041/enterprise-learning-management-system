package com.lms.common.events;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Canonical event envelope for Kafka messages.
 * See docs/05-events-kafka.md.
 */
@Builder
public record EventEnvelope<T>(
    @NotNull UUID eventId,
    @NotNull String eventType,
    @NotNull String aggregateId,
    int version,
    @NotNull Instant timestamp,
    @NotNull T payload,
    Map<String, String> metadata) {
  public static <T> EventEnvelope<T> of(String eventType, String aggregateId, T payload, Map<String, String> metadata) {
    return new EventEnvelope<>(
        UUID.randomUUID(),
        eventType,
        aggregateId,
        1,
        Instant.now(),
        payload,
        metadata != null ? Map.copyOf(metadata) : Map.of());
  }
}
