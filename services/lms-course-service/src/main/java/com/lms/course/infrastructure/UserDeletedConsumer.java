package com.lms.course.infrastructure;

import com.lms.common.events.EventEnvelope;
import com.lms.common.events.UserDeletedEvent;
import com.lms.course.application.CourseApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserDeletedConsumer {

  private final CourseApplicationService courseService;

  @KafkaListener(topics = "user.events", groupId = "course-service-group")
  public void handleUserDeleted(EventEnvelope<UserDeletedEvent> envelope) {
    UserDeletedEvent event = envelope.payload();
    log.info("Received UserDeletedEvent for user: {}", event.getUserId());
    try {
      courseService.cleanupUserData(event.getUserId());
      log.info("Successfully cleaned up course data for user: {}", event.getUserId());
    } catch (Exception e) {
      log.error("Failed to cleanup course data for user: {}", event.getUserId(), e);
    }
  }
}
