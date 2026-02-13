package com.lms.analytics.service;

import com.lms.analytics.dto.*;
import com.lms.analytics.model.EnrollmentAggregate;
import com.lms.analytics.model.LectureEngagement;
import com.lms.analytics.repository.EnrollmentAggregateRepository;
import com.lms.analytics.repository.LectureEngagementRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnalyticsService {

  @Autowired
  private EnrollmentAggregateRepository enrollmentAggregateRepository;

  @Autowired
  private LectureEngagementRepository lectureEngagementRepository;

  @Autowired
  private MeterRegistry meterRegistry;

  @Transactional
  public void recordPlaybackEvent(PlaybackTelemetryRequest request) {
    log.info("Recording playback event: {} for user: {} on lesson: {}",
        request.getEventType(), request.getUserId(), request.getLessonId());

    meterRegistry.counter("lms.playback.events",
        "type", request.getEventType().name(),
        "courseId", request.getCourseId() != null ? request.getCourseId().toString() : "unknown").increment();

    if (request.getLessonId() != null && request.getCourseId() != null) {
      updateLectureEngagement(request);
    }
  }

  private void updateLectureEngagement(PlaybackTelemetryRequest request) {
    LocalDate today = LocalDate.now();
    LectureEngagement engagement = lectureEngagementRepository
        .findByLessonIdAndDate(request.getLessonId(), today)
        .orElse(LectureEngagement.builder()
            .lessonId(request.getLessonId())
            .courseId(request.getCourseId())
            .date(today)
            .totalWatches(0)
            .totalCompletes(0)
            .totalWatchTimeSecs(0L)
            .avgWatchTimeSecs(0.0)
            .build());

    switch (request.getEventType()) {
      case PLAY:
        engagement.incrementWatches();
        break;
      case COMPLETE:
        engagement.incrementCompletes();
        break;
      case HEARTBEAT:
        // Assume 30s heartbeat if not specified
        engagement.addWatchTime(30);
        break;
      default:
        break;
    }

    lectureEngagementRepository.save(engagement);
  }

  @Transactional(readOnly = true)
  public InstructorCourseAnalyticsDTO getInstructorCourseAnalytics(UUID courseId, LocalDate start, LocalDate end) {
    // In a real system, we'd join with course service to get titles.
    // For now, we aggregate what we have in analytics DB.

    List<LectureEngagement> metrics = lectureEngagementRepository
        .findAllByCourseIdAndDateBetween(courseId, start, end);

    Map<UUID, List<LectureEngagement>> byLesson = metrics.stream()
        .collect(Collectors.groupingBy(LectureEngagement::getLessonId));

    List<InstructorCourseAnalyticsDTO.LessonEngagementDTO> lessonDTOs = new ArrayList<>();

    byLesson.forEach((lessonId, reports) -> {
      int totalWatches = reports.stream().mapToInt(LectureEngagement::getTotalWatches).sum();
      int totalCompletes = reports.stream().mapToInt(LectureEngagement::getTotalCompletes).sum();
      double totalWatchTime = reports.stream().mapToLong(LectureEngagement::getTotalWatchTimeSecs).sum();

      lessonDTOs.add(InstructorCourseAnalyticsDTO.LessonEngagementDTO.builder()
          .lessonId(lessonId)
          .lessonTitle("Lesson " + lessonId.toString().substring(0, 8))
          .totalWatches(totalWatches)
          .totalCompletes(totalCompletes)
          .completionRate(totalWatches > 0 ? (double) totalCompletes / totalWatches : 0.0)
          .averageWatchTimeSecs(totalWatches > 0 ? totalWatchTime / totalWatches : 0.0)
          .build());
    });

    return InstructorCourseAnalyticsDTO.builder()
        .courseId(courseId)
        .lessonMetrics(lessonDTOs)
        .build();
  }

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

    meterRegistry.counter("lms.enrollments.total", "courseId", courseId.toString()).increment();

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

    meterRegistry.counter("lms.enrollments.completed", "courseId", courseId.toString()).increment();

    log.info("Updated completion aggregate for course: {}", courseId);
  }

  public EnrollmentAggregate getEnrollmentStats(Long courseId, LocalDate date) {
    return enrollmentAggregateRepository.findByCourseIdAndDate(courseId, date)
        .orElse(null);
  }

  public List<EnrollmentTrendDTO> getEnrollmentTrends() {
    return enrollmentAggregateRepository.findEnrollmentTrends();
  }

  public GlobalStatsDTO getGlobalStats() {
    Long totalEnrollments = enrollmentAggregateRepository.sumTotalEnrollments();
    Long totalCourses = enrollmentAggregateRepository.countDistinctCourses();
    Long activeLearners = enrollmentAggregateRepository.sumActiveEnrollmentsSince(LocalDate.now().minusDays(30));

    return GlobalStatsDTO.builder()
        .totalEnrollments(totalEnrollments != null ? totalEnrollments : 0L)
        .totalCourses(totalCourses != null ? totalCourses : 0L)
        .totalStudents(totalEnrollments != null ? totalEnrollments : 0L) // Simplified: 1 student per enrollment for now
        .activeLearnersLast30Days(activeLearners != null ? activeLearners : 0L)
        .totalRevenue(0.0) // Placeholder
        .build();
  }

  public List<CourseAnalyticsDTO> getCourseAnalytics() {
    List<Object[]> stats = enrollmentAggregateRepository.findCourseEnrollmentStats();
    return stats.stream().map(row -> {
      Long id = (Long) row[0];
      Long total = (Long) row[1];
      Long completed = (Long) row[2];
      double completionRate = total > 0 ? (completed * 100.0 / total) : 0.0;

      return CourseAnalyticsDTO.builder()
          .courseId(String.valueOf(id))
          .courseTitle("Course " + id) // Placeholder
          .totalEnrollments(total)
          .completionRate(completionRate)
          .averageRating(4.5) // Placeholder
          .revenue(0.0) // Placeholder
          .build();
    }).collect(Collectors.toList());
  }
}
