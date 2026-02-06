package com.lms.notification.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.common.events.EventEnvelope;
import com.lms.notification.event.DomainEvent;
import com.lms.notification.service.NotificationService;
import com.lms.notification.service.WebhookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class EventConsumer {

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private WebhookService webhookService;

  @Autowired
  private ObjectMapper objectMapper;

  @KafkaListener(topics = {
      "user.events",
      "enrollment.events",
      "assignment.events",
      "payment.events",
      "course.events",
      "assignment-events" // Added some common variants
  }, groupId = "notification-service")
  public void consume(String message) {
    try {
      log.debug("Received message: {}", message);

      // Try parsing as EventEnvelope first
      EventEnvelope envelope;
      try {
        envelope = objectMapper.readValue(message, EventEnvelope.class);
      } catch (Exception e) {
        // Fallback to DomainEvent if it matches that structure
        DomainEvent domainEvent = objectMapper.readValue(message, DomainEvent.class);
        envelope = new EventEnvelope(
            UUID.randomUUID(),
            domainEvent.getEventType(),
            domainEvent.getAggregateId(),
            1,
            domainEvent.getOccurredAt() != null ? domainEvent.getOccurredAt() : Instant.now(),
            domainEvent.getPayload(),
            Map.of("source", "legacy-domain-event"));
      }

      // 1. Process for Webhooks
      webhookService.processEvent(envelope);

      // 2. Process for Email/In-App (existing logic)
      DomainEvent de = DomainEvent.builder()
          .eventType(envelope.eventType())
          .aggregateId(envelope.aggregateId())
          .occurredAt(envelope.timestamp())
          .payload((Map<String, Object>) envelope.payload())
          .build();
      notificationService.handleDomainEvent(de);

    } catch (Exception e) {
      log.error("Error processing message: {}", message, e);
    }
  }
}
