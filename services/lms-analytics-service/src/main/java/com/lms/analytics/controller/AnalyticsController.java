package com.lms.analytics.controller;

import com.lms.common.security.RBACEnforcer;
import com.lms.analytics.dto.*;
import com.lms.analytics.model.EnrollmentAggregate;
import com.lms.analytics.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

  @Autowired
  private AnalyticsService analyticsService;

  @Autowired(required = false)
  private RBACEnforcer rbacEnforcer;

  private static final String HEADER_USER_ID = "X-User-Id";

  @PostMapping("/playback")
  public ResponseEntity<Void> recordPlaybackEvent(
      @RequestBody PlaybackTelemetryRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String userIdHeader) {

    if (userIdHeader != null) {
      request.setUserId(UUID.fromString(userIdHeader));
    }

    log.debug("Received playback telemetry: {} for lesson {}", request.getEventType(), request.getLessonId());
    analyticsService.recordPlaybackEvent(request);
    return ResponseEntity.accepted().build();
  }

  @GetMapping("/course/{courseId}")
  public ResponseEntity<InstructorCourseAnalyticsDTO> getInstructorCourseAnalytics(
      @PathVariable UUID courseId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

    if (rbacEnforcer != null) {
      rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    }

    if (startDate == null)
      startDate = LocalDate.now().minusDays(30);
    if (endDate == null)
      endDate = LocalDate.now();

    InstructorCourseAnalyticsDTO analytics = analyticsService.getInstructorCourseAnalytics(courseId, startDate,
        endDate);
    return ResponseEntity.ok(analytics);
  }

  @GetMapping("/enrollments")
  public ResponseEntity<EnrollmentAggregate> getEnrollmentStats(
      @RequestParam Long courseId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

    // RBAC: Only admins and instructors can access analytics
    if (rbacEnforcer != null) {
      rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    }

    if (date == null) {
      date = LocalDate.now();
    }

    EnrollmentAggregate stats = analyticsService.getEnrollmentStats(courseId, date);
    return ResponseEntity.ok(stats);
  }

  @GetMapping("/trends")
  public ResponseEntity<List<EnrollmentTrendDTO>> getTrends() {
    if (rbacEnforcer != null) {
      rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    }
    return ResponseEntity.ok(analyticsService.getEnrollmentTrends());
  }

  @GetMapping("/global")
  public ResponseEntity<GlobalStatsDTO> getGlobalStats() {
    if (rbacEnforcer != null) {
      rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    }
    return ResponseEntity.ok(analyticsService.getGlobalStats());
  }

  @GetMapping("/courses")
  public ResponseEntity<List<CourseAnalyticsDTO>> getCourseAnalytics() {
    if (rbacEnforcer != null) {
      rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    }
    return ResponseEntity.ok(analyticsService.getCourseAnalytics());
  }
}
