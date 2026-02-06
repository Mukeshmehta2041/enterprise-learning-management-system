package com.lms.user.infrastructure;

import com.lms.common.events.EventEnvelope;
import com.lms.common.events.UserDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

  private final KafkaTemplate<String, Object> kafkaTemplate;
  private static final String USER_TOPIC = "user-events";

  public void publishUserDeleted(UUID userId) {
    UserDeletedEvent event = UserDeletedEvent.builder()
        .userId(userId)
        .timestamp(System.currentTimeMillis())
        .hardDelete(true)
        .build();
    EventEnvelope<UserDeletedEvent> envelope = EventEnvelope.<UserDeletedEvent>builder()
        .eventId(UUID.randomUUID())
        .aggregateId(userId.toString())
        .eventType("USER_DELETED")
        .payload(event)
        .timestamp(java.time.Instant.now())
        .build();

    kafkaTemplate.send(USER_TOPIC, userId.toString(), envelope);
    log.info("Published user deleted event for user: {}", userId);
  }
}
