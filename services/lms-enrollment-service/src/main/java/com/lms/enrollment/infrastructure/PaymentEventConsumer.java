package com.lms.enrollment.infrastructure;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.enrollment.application.EnrollmentApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventConsumer {

  private final EnrollmentApplicationService enrollmentService;
  private final ObjectMapper objectMapper;

  @KafkaListener(topics = "payment.events", groupId = "enrollment-service-group")
  public void onPaymentEvent(String message) {
    try {
      JsonNode event = objectMapper.readTree(message);
      String eventType = event.get("eventType").asText();

      if ("PaymentCompleted".equals(eventType)) {
        JsonNode payload = event.get("payload");
        UUID userId = UUID.fromString(payload.get("userId").asText());

        if (payload.has("courseId") && !payload.get("courseId").isNull()) {
          UUID courseId = UUID.fromString(payload.get("courseId").asText());
          log.info("Processing PaymentCompleted for user {} and course {}", userId, courseId);
          enrollmentService.activateEnrollment(userId, courseId);
        }
      }
    } catch (Exception e) {
      log.error("Error processing payment event: {}", message, e);
    }
  }
}
