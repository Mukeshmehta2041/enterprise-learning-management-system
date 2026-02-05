package com.lms.enrollment.api;

import com.lms.enrollment.application.EnrollmentApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/enrollments")
public class EnrollmentController {

  private static final String HEADER_USER_ID = "X-User-Id";
  private static final String HEADER_ROLES = "X-Roles";

  private final EnrollmentApplicationService enrollmentService;

  public EnrollmentController(EnrollmentApplicationService enrollmentService) {
    this.enrollmentService = enrollmentService;
  }

  @PostMapping
  public ResponseEntity<EnrollmentResponse> enroll(
      @Valid @RequestBody EnrollRequest request,
      @RequestHeader(HEADER_USER_ID) String userIdHeader) {

    UUID userId = UUID.fromString(userIdHeader);
    EnrollmentResponse response = enrollmentService.enroll(userId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/me")
  public ResponseEntity<EnrollmentListResponse> getMyEnrollments(
      @RequestHeader(HEADER_USER_ID) String userIdHeader,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer limit) {

    UUID userId = UUID.fromString(userIdHeader);
    EnrollmentListResponse response = enrollmentService.getMyEnrollments(userId, cursor, limit);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<EnrollmentListResponse> listMyEnrollments(
      @RequestHeader(HEADER_USER_ID) String userIdHeader,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer limit) {

    UUID userId = UUID.fromString(userIdHeader);
    EnrollmentListResponse response = enrollmentService.getMyEnrollments(userId, cursor, limit);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{enrollmentId}")
  public ResponseEntity<EnrollmentResponse> getEnrollment(
      @PathVariable UUID enrollmentId,
      @RequestHeader(HEADER_USER_ID) String userIdHeader,
      @RequestHeader(value = HEADER_ROLES, required = false) String rolesHeader) {

    UUID userId = UUID.fromString(userIdHeader);
    Set<String> roles = parseRoles(rolesHeader);

    EnrollmentResponse response = enrollmentService.getEnrollment(enrollmentId, userId, roles);
    return ResponseEntity.ok(response);
  }

  @PatchMapping("/{enrollmentId}/progress")
  public ResponseEntity<Void> updateProgress(
      @PathVariable UUID enrollmentId,
      @Valid @RequestBody UpdateProgressRequest request,
      @RequestHeader(HEADER_USER_ID) String userIdHeader) {

    UUID userId = UUID.fromString(userIdHeader);
    enrollmentService.updateProgress(enrollmentId, request, userId);
    return ResponseEntity.noContent().build();
  }

  private Set<String> parseRoles(String rolesHeader) {
    if (rolesHeader == null || rolesHeader.isBlank()) {
      return new HashSet<>();
    }
    return Arrays.stream(rolesHeader.split(","))
        .map(String::trim)
        .collect(Collectors.toSet());
  }
}
