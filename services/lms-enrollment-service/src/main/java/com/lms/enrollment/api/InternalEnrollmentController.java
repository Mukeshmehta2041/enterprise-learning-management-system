package com.lms.enrollment.api;

import com.lms.enrollment.application.EnrollmentApplicationService;
import com.lms.enrollment.domain.Enrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/internal/enrollments")
@RequiredArgsConstructor
public class InternalEnrollmentController {

  private final EnrollmentApplicationService enrollmentService;

  @GetMapping("/export")
  public ResponseEntity<List<Map<String, Object>>> exportByUserId(@RequestParam UUID userId) {
    List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUserId(userId);

    List<Map<String, Object>> response = enrollments.stream()
        .map(e -> {
          Map<String, Object> map = new HashMap<>();
          map.put("id", e.getId().toString());
          map.put("courseId", e.getCourseId().toString());
          map.put("status", e.getStatus().name());
          map.put("progressPercent", e.getProgressPct());
          map.put("enrolledAt", e.getEnrolledAt().toString());
          return map;
        })
        .collect(Collectors.toList());

    return ResponseEntity.ok(response);
  }
}
