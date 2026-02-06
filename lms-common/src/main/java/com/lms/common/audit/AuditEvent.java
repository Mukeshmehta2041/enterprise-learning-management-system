package com.lms.common.audit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent {
  private String eventId;
  private Instant timestamp;
  private String actorId; // UserId of the person performing the action
  private String action; // e.g., "COURSE_PUBLISH", "GRADE_CHANGE", "USER_LOGIN"
  private String resourceType; // e.g., "COURSE", "ENROLLMENT", "USER"
  private String resourceId;
  private String status; // SUCCESS, FAILURE
  private String outcome; // Detailed outcome message or error
  private Map<String, Object> metadata; // Extra context (non-PII)
}
