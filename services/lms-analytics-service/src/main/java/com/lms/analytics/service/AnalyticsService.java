package com.lms.analytics.service;

import com.lms.analytics.model.EnrollmentAggregate;
import com.lms.analytics.repository.EnrollmentAggregateRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
@Service
public class AnalyticsService {

  @Autowired
  private EnrollmentAggregateRepository enrollmentAggregateRepository;

  @Transactional
  public void handleEvent(Map<String, Object> event) {
    String eventType = (String) event.get("eventType");

    switch (eventType) {
      case "EnrollmentCreated":
        handleEnrollmentCreated(event);
        break;
      case "EnrollmentCompleted":
        handleEnrollmentCompleted(event);
        break;
      case "CourseCreated":
        log.info("Course created event received");
        break;
      case "AssignmentSubmitted":
        log.info("Assignment submission event received");
        break;
      case "PaymentCompleted":
        log.info("Payment completed event received");
        break;
      default:
        log.debug("No aggregation handler for event: {}", eventType);
    }
  }

  private void handleEnrollmentCreated(Map<String, Object> event) {
    Map<String, Object> payload = (Map<String, Object>) event.get("payload");
    Long courseId = ((Number) payload.get("courseId")).longValue();

    EnrollmentAggregate aggregate = enrollmentAggregateRepository
        .findByCourseIdAndDate(courseId, LocalDate.now())
        .orElse(EnrollmentAggregate.builder()
            .courseId(courseId)
            .date(LocalDate.now())
            .build());

    aggregate.incrementTotal();
    aggregate.incrementActive();
    enrollmentAggregateRepository.save(aggregate);

    log.info("Updated enrollment aggregate for course: {}", courseId);
  }

  private void handleEnrollmentCompleted(Map<String, Object> event) {
    Map<String, Object> payload = (Map<String, Object>) event.get("payload");
    Long courseId = ((Number) payload.get("courseId")).longValue();

    EnrollmentAggregate aggregate = enrollmentAggregateRepository
        .findByCourseIdAndDate(courseId, LocalDate.now())
        .orElse(EnrollmentAggregate.builder()
            .courseId(courseId)
            .date(LocalDate.now())
            .build());

    aggregate.incrementCompleted();
    enrollmentAggregateRepository.save(aggregate);

    log.info("Updated completion aggregate for course: {}", courseId);
  }

  public EnrollmentAggregate getEnrollmentStats(Long courseId, LocalDate date) {
    return enrollmentAggregateRepository.findByCourseIdAndDate(courseId, date)
        .orElse(null);
  }
}
