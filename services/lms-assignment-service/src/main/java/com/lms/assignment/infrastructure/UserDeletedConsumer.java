package com.lms.assignment.infrastructure;

import com.lms.common.events.UserDeletedEvent;
import com.lms.assignment.application.AssignmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserDeletedConsumer {

  private final AssignmentService assignmentService;

  @KafkaListener(topics = "user-deleted", groupId = "assignment-service-group")
  public void handleUserDeleted(UserDeletedEvent event) {
    log.info("Received UserDeletedEvent for user: {}", event.getUserId());
    try {
      assignmentService.cleanupUserData(event.getUserId());
      log.info("Successfully cleaned up assignment data for user: {}", event.getUserId());
    } catch (Exception e) {
      log.error("Failed to cleanup assignment data for user: {}", event.getUserId(), e);
    }
  }
}
