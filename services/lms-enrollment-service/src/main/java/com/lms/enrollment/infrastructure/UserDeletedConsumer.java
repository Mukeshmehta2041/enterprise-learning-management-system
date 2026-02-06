package com.lms.enrollment.infrastructure;

import com.lms.common.events.UserDeletedEvent;
import com.lms.enrollment.application.EnrollmentApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserDeletedConsumer {

  private final EnrollmentApplicationService enrollmentService;

  @KafkaListener(topics = "user-deleted", groupId = "enrollment-service-group")
  public void handleUserDeleted(UserDeletedEvent event) {
    log.info("Received UserDeletedEvent for user: {}", event.getUserId());
    try {
      enrollmentService.cleanupUserData(event.getUserId());
      log.info("Successfully cleaned up data for user: {}", event.getUserId());
    } catch (Exception e) {
      log.error("Failed to cleanup data for user: {}", event.getUserId(), e);
    }
  }
}
