package com.lms.assignment.api;

import com.lms.assignment.application.AssignmentService;
import com.lms.assignment.domain.Assignment;
import com.lms.assignment.domain.Grade;
import com.lms.assignment.domain.Submission;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {
  private final AssignmentService assignmentService;

  private static final String HEADER_USER_ID = "X-User-Id";
  private static final String HEADER_ROLES = "X-Roles";

  @GetMapping
  public List<Assignment> getAllAssignments() {
    // This should probably be restricted to ADMIN or handled by course filtering
    return assignmentService.getAllAssignments();
  }

  @GetMapping("/{id}")
  public Assignment getAssignment(@PathVariable UUID id) {
    return assignmentService.getAssignmentById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Assignment createAssignment(
      @RequestBody @Valid CreateAssignmentRequest request,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    return assignmentService.createAssignment(request, userId, roles);
  }

  @GetMapping("/course/{courseId}")
  public List<Assignment> getAssignmentsByCourse(@PathVariable UUID courseId) {
    return assignmentService.getAssignmentsByCourse(courseId);
  }

  @PostMapping("/{assignmentId}/submit")
  @ResponseStatus(HttpStatus.CREATED)
  public Submission submitAssignment(
      @PathVariable UUID assignmentId,
      @RequestHeader(HEADER_USER_ID) UUID studentId,
      @RequestBody @Valid SubmitAssignmentRequest request) {
    return assignmentService.submitAssignment(assignmentId, studentId, request);
  }

  @GetMapping("/{assignmentId}/submissions")
  public List<Submission> getSubmissions(
      @PathVariable UUID assignmentId,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    return assignmentService.getSubmissionsByAssignment(assignmentId, userId, roles);
  }

  @PostMapping("/submissions/{submissionId}/grade")
  public Grade gradeSubmission(
      @PathVariable UUID submissionId,
      @RequestHeader(HEADER_USER_ID) UUID instructorId,
      @RequestHeader(HEADER_ROLES) String rolesHeader,
      @RequestBody @Valid GradeSubmissionRequest request) {
    Set<String> roles = parseRoles(rolesHeader);
    return assignmentService.gradeSubmission(submissionId, instructorId, roles, request);
  }

  private Set<String> parseRoles(String rolesHeader) {
    if (rolesHeader == null || rolesHeader.isBlank()) {
      return java.util.Collections.emptySet();
    }
    return java.util.Arrays.stream(rolesHeader.split(","))
        .map(String::trim)
        .collect(java.util.stream.Collectors.toSet());
  }
}
