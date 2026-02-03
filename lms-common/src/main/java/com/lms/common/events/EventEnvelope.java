package com.lms.common.events;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Canonical event envelope for Kafka messages.
 * See docs/05-events-kafka.md.
 */
public record EventEnvelope(
        @NotNull UUID eventId,
        @NotNull String eventType,
        @NotNull String aggregateId,
        int version,
        @NotNull Instant timestamp,
        @NotNull Object payload,
        Map<String, String> metadata
) {
    public static EventEnvelope of(String eventType, String aggregateId, Object payload, Map<String, String> metadata) {
        return new EventEnvelope(
                UUID.randomUUID(),
                eventType,
                aggregateId,
                1,
                Instant.now(),
                payload,
                metadata != null ? Map.copyOf(metadata) : Map.of()
        );
    }
}
