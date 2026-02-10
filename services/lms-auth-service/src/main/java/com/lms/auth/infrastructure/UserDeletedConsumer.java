package com.lms.auth.infrastructure;

import com.lms.auth.application.RefreshTokenService;
import com.lms.common.events.EventEnvelope;
import com.lms.common.events.UserDeletedEvent;
import com.lms.common.audit.AuditLogger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserDeletedConsumer {

  private final RefreshTokenService refreshTokenService;
  private final AuditLogger auditLogger;

  @KafkaListener(topics = "user.events", groupId = "auth-service-group")
  public void handleUserDeleted(EventEnvelope<UserDeletedEvent> envelope) {
    UserDeletedEvent event = (UserDeletedEvent) envelope.payload();
    UUID userId = event.getUserId();
    log.info("Received UserDeletedEvent for user: {}", userId);

    try {
      refreshTokenService.revokeAllForUser(userId);
      auditLogger.logSuccess("USER_AUTH_CLEANUP", "USER", userId.toString());
      log.info("Successfully revoked all tokens for deleted user: {}", userId);
    } catch (Exception e) {
      log.error("Failed to revoke tokens for user: {}", userId, e);
      auditLogger.logFailure("USER_AUTH_CLEANUP", "USER", userId.toString(), e.getMessage());
    }
  }
}
