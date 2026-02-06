package com.lms.common.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.common.security.UserContext;
import com.lms.common.security.UserContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class AuditLogger {
  private final ObjectMapper objectMapper;
  private static final String AUDIT_MARKER = "AUDIT_EVENT";

  public AuditLogger(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public void log(String action, String resourceType, String resourceId, String status, String outcome,
      Map<String, Object> metadata) {
    UserContext userContext = UserContextHolder.getContext();
    String actorId = (userContext != null) ? userContext.getUserId() : "SYSTEM";

    AuditEvent event = AuditEvent.builder()
        .eventId(UUID.randomUUID().toString())
        .timestamp(Instant.now())
        .actorId(actorId)
        .action(action)
        .resourceType(resourceType)
        .resourceId(resourceId)
        .status(status)
        .outcome(outcome)
        .metadata(metadata)
        .build();

    try {
      String jsonEvent = objectMapper.writeValueAsString(event);
      log.info("{} {}", AUDIT_MARKER, jsonEvent);
    } catch (JsonProcessingException e) {
      log.error("Failed to serialize audit event", e);
    }
  }

  public void logSuccess(String action, String resourceType, String resourceId) {
    log(action, resourceType, resourceId, "SUCCESS", null, null);
  }

  public void logSuccess(String action, String resourceType, String resourceId, Map<String, Object> metadata) {
    log(action, resourceType, resourceId, "SUCCESS", null, metadata);
  }

  public void logFailure(String action, String resourceType, String resourceId, String error) {
    log(action, resourceType, resourceId, "FAILURE", error, null);
  }
}
