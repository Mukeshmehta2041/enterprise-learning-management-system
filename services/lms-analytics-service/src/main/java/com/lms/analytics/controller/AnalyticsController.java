package com.lms.analytics.controller;

import com.lms.common.security.RBACEnforcer;
import com.lms.analytics.dto.CourseAnalyticsDTO;
import com.lms.analytics.dto.EnrollmentTrendDTO;
import com.lms.analytics.dto.GlobalStatsDTO;
import com.lms.analytics.model.EnrollmentAggregate;
import com.lms.analytics.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

  @Autowired
  private AnalyticsService analyticsService;

  @Autowired(required = false)
  private RBACEnforcer rbacEnforcer;

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
