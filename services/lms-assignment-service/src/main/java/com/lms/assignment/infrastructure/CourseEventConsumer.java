package com.lms.assignment.infrastructure;

import com.lms.assignment.domain.Assignment;
import com.lms.common.events.EventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class CourseEventConsumer {
  private final AssignmentRepository assignmentRepository;

  @KafkaListener(topics = "course.events", groupId = "assignment-service-group")
  @Transactional
  public void handleCourseEvent(EventEnvelope<Map<String, Object>> event) {
    String eventType = event.eventType();
    log.info("Received course event: {}", eventType);

    switch (eventType) {
      case "CourseDeleted":
        handleCourseDeleted(event.payload());
        break;
      case "ModuleDeleted":
        handleModuleDeleted(event.payload());
        break;
      case "LessonDeleted":
        handleLessonDeleted(event.payload());
        break;
      default:
        log.debug("Ignoring event type: {}", eventType);
    }
  }

  private void handleCourseDeleted(Map<String, Object> payload) {
    UUID courseId = UUID.fromString(payload.get("id").toString());
    log.info("Deleting assignments for deleted course: {}", courseId);
    List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
    assignmentRepository.deleteAll(assignments);
  }

  private void handleModuleDeleted(Map<String, Object> payload) {
    UUID moduleId = UUID.fromString(payload.get("moduleId").toString());
    log.info("Cleaning up assignments for deleted module: {}", moduleId);
    List<Assignment> assignments = assignmentRepository.findByModuleId(moduleId);
    for (Assignment assignment : assignments) {
      assignment.setModuleId(null);
      assignmentRepository.save(assignment);
    }
  }

  private void handleLessonDeleted(Map<String, Object> payload) {
    UUID lessonId = UUID.fromString(payload.get("lessonId").toString());
    log.info("Cleaning up assignments for deleted lesson: {}", lessonId);
    List<Assignment> assignments = assignmentRepository.findByLessonId(lessonId);
    for (Assignment assignment : assignments) {
      assignment.setLessonId(null);
      assignmentRepository.save(assignment);
    }
  }
}
