package com.lms.enrollment.infrastructure;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.common.events.EventEnvelope;
import com.lms.common.events.PaymentCompletedEvent;
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
  public void onPaymentEvent(EventEnvelope<PaymentCompletedEvent> envelope) {
    try {
      String eventType = envelope.eventType();
      if ("PaymentCompleted".equals(eventType)) {
        PaymentCompletedEvent payload = objectMapper.convertValue(envelope.payload(), PaymentCompletedEvent.class);
        UUID userId = payload.userId();

        if (payload.courseId() != null) {
          UUID courseId = payload.courseId();
          log.info("Processing PaymentCompleted for user {} and course {}", userId, courseId);
          enrollmentService.activateEnrollment(userId, courseId);
        } else if (payload.planId() != null) {
          log.info("Processing PaymentCompleted for user {} and plan {}", userId, payload.planId());
          // Handle subscription plan activation if needed
        }
      }
    } catch (Exception e) {
      log.error("Error processing payment event: {}", envelope, e);
    }
  }
}
