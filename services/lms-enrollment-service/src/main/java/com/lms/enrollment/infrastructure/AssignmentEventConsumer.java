package com.lms.enrollment.infrastructure;

import com.lms.common.events.EventEnvelope;
import com.lms.enrollment.application.EnrollmentApplicationService;
import com.lms.enrollment.domain.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssignmentEventConsumer {

  private final EnrollmentApplicationService enrollmentService;
  private final EnrollmentRepository enrollmentRepository;

  @KafkaListener(topics = "assignment.events", groupId = "enrollment-service-group")
  public void handleAssignmentEvent(EventEnvelope<Map<String, Object>> event) {
    String eventType = event.eventType();
    log.info("Received assignment event: {}", eventType);

    if ("AssignmentGraded".equals(eventType)) {
      handleAssignmentGraded(event.payload());
    }
  }

  private void handleAssignmentGraded(Map<String, Object> payload) {
    UUID studentId = UUID.fromString(payload.get("studentId").toString());
    UUID courseId = UUID.fromString(payload.get("courseId").toString());
    UUID assignmentId = UUID.fromString(payload.get("assignmentId").toString());
    String lessonIdStr = (String) payload.get("lessonId");
    UUID lessonId = (lessonIdStr != null && !lessonIdStr.isBlank()) ? UUID.fromString(lessonIdStr) : null;

    log.info("Recording assignment completion for student {} in assignment {}", studentId, assignmentId);

    enrollmentRepository.findByUserIdAndCourseId(studentId, courseId).ifPresent(enrollment -> {
      enrollmentService.recordAssignmentCompletion(enrollment.getId(), assignmentId, lessonId);
    });
  }
}
