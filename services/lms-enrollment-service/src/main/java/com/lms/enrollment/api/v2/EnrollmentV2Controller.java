package com.lms.enrollment.api.v2;

import com.lms.enrollment.application.EnrollmentApplicationService;
import com.lms.enrollment.api.EnrollmentListResponse;
import com.lms.enrollment.api.EnrollmentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v2/enrollments")
public class EnrollmentV2Controller {

  private final EnrollmentApplicationService enrollmentService;

  public EnrollmentV2Controller(EnrollmentApplicationService enrollmentService) {
    this.enrollmentService = enrollmentService;
  }

  @GetMapping("/me")
  public ResponseEntity<EnrollmentListResponseV2> getMyEnrollments(
      @RequestHeader("X-User-Id") String userIdHeader,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer limit) {

    UUID userId = UUID.fromString(userIdHeader);
    EnrollmentListResponse v1 = enrollmentService.getMyEnrollments(userId, cursor, limit);

    List<EnrollmentResponseV2> v2List = v1.content().stream()
        .map(this::mapToV2)
        .collect(Collectors.toList());

    return ResponseEntity.ok(new EnrollmentListResponseV2(v2List, v1.nextCursor(), (long) v2List.size()));
  }

  private EnrollmentResponseV2 mapToV2(EnrollmentResponse v1) {
    return new EnrollmentResponseV2(
        v1.id(),
        v1.courseId(),
        v1.courseTitle(),
        v1.courseThumbnailUrl(),
        v1.userId(),
        v1.status(),
        v1.progressPct(),
        UUID.randomUUID(), // Mocked next lesson
        "Introduction to Advanced Topics", // Mocked title
        v1.enrolledAt(),
        v1.completedAt(),
        v1.lastAccessedAt());
  }
}
