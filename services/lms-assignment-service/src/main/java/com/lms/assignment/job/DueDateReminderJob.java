package com.lms.assignment.job;

import com.lms.assignment.domain.Assignment;
import com.lms.assignment.infrastructure.AssignmentRepository;
import com.lms.common.events.EventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DueDateReminderJob {

  private final AssignmentRepository assignmentRepository;
  private final KafkaTemplate<String, Object> kafkaTemplate;

  // Run every hour
  @Scheduled(cron = "0 0 * * * *")
  public void checkDueDates() {
    log.info("Checking for assignments due in 24 hours...");

    OffsetDateTime now = OffsetDateTime.now();
    OffsetDateTime twentyFourHoursFromNow = now.plusHours(24);
    OffsetDateTime twentyFiveHoursFromNow = now.plusHours(25);

    // Find assignments due between 24 and 25 hours from now
    // This ensures we notify once (if run hourly)
    List<Assignment> dueSoon = assignmentRepository.findByDueDateBetween(
        twentyFourHoursFromNow,
        twentyFiveHoursFromNow);

    for (Assignment assignment : dueSoon) {
      log.info("Assignment '{}' (id: {}) is due in 24 hours. Publishing event.",
          assignment.getTitle(), assignment.getId());

      kafkaTemplate.send("assignment.events", assignment.getId().toString(), EventEnvelope.of(
          "AssignmentDueSoon",
          assignment.getId().toString(),
          Map.of(
              "courseId", assignment.getCourseId(),
              "title", assignment.getTitle(),
              "dueDate", assignment.getDueDate()),
          null));
    }
  }
}
