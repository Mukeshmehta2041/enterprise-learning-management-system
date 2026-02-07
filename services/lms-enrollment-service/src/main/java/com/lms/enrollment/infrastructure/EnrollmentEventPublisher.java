package com.lms.enrollment.infrastructure;

import com.lms.common.events.EnrollmentEvent;
import com.lms.common.events.EventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class EnrollmentEventPublisher {

  private final KafkaTemplate<String, Object> kafkaTemplate;
  private static final String TOPIC = "enrollment.events";

  public void publishEnrollmentCreated(UUID enrollmentId, UUID userId, UUID courseId) {
    EnrollmentEvent event = EnrollmentEvent.builder()
        .enrollmentId(enrollmentId)
        .userId(userId)
        .courseId(courseId)
        .status("ACTIVE")
        .timestamp(System.currentTimeMillis())
        .build();

    EventEnvelope<EnrollmentEvent> envelope = EventEnvelope.<EnrollmentEvent>builder()
        .eventId(UUID.randomUUID())
        .aggregateId(enrollmentId.toString())
        .eventType("ENROLLMENT_CREATED")
        .payload(event)
        .timestamp(java.time.Instant.now())
        .version(1)
        .build();

    kafkaTemplate.send(TOPIC, enrollmentId.toString(), envelope);
    log.info("Published enrollment created event for enrollment: {}", enrollmentId);
  }
}
