package com.lms.assignment.application;

import com.lms.assignment.api.CreateAssignmentRequest;
import com.lms.assignment.api.GradeSubmissionRequest;
import com.lms.assignment.api.SubmitAssignmentRequest;
import com.lms.assignment.client.CourseServiceClient;
import com.lms.assignment.domain.Assignment;
import com.lms.assignment.domain.Grade;
import com.lms.assignment.domain.Submission;
import com.lms.assignment.infrastructure.AssignmentRepository;
import com.lms.assignment.infrastructure.GradeRepository;
import com.lms.assignment.infrastructure.SubmissionRepository;
import com.lms.common.exception.ResourceNotFoundException;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.events.EventEnvelope;
import com.lms.common.security.RBACEnforcer;
import com.lms.common.security.UserContext;
import com.lms.common.security.UserContextHolder;
import com.lms.common.audit.AuditLogger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentService {
  private final AssignmentRepository assignmentRepository;
  private final SubmissionRepository submissionRepository;
  private final GradeRepository gradeRepository;
  private final KafkaTemplate<String, Object> kafkaTemplate;
  private final CourseServiceClient courseServiceClient;
  private final AuditLogger auditLogger;

  @Transactional
  public Assignment createAssignment(CreateAssignmentRequest request, UUID userId, Set<String> roles) {
    // Only instructor of course or admin can create assignment
    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(request.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to create assignment for this course");
    }

    Assignment assignment = Assignment.builder()
        .id(UUID.randomUUID())
        .courseId(request.getCourseId())
        .title(request.getTitle())
        .description(request.getDescription())
        .dueDate(request.getDueDate())
        .maxScore(request.getMaxScore())
        .build();
    Assignment saved = assignmentRepository.save(assignment);

    // Notify via Kafka
    kafkaTemplate.send("assignment.events", saved.getId().toString(), EventEnvelope.of(
        "AssignmentCreated",
        saved.getId().toString(),
        Map.of("courseId", saved.getCourseId()),
        null));

    auditLogger.logSuccess("ASSIGNMENT_CREATE", "ASSIGNMENT", saved.getId().toString(),
        Map.of("courseId", saved.getCourseId()));
    return saved;
  }

  @Transactional(readOnly = true)
  public List<Submission> getSubmissionsByStudentId(UUID studentId) {
    return submissionRepository.findAllByStudentId(studentId);
  }

  @Transactional
  public void cleanupUserData(UUID userId) {
    log.info("Cleaning up assignment data for user: {}", userId);
    gradeRepository.deleteBySubmissionStudentId(userId);
    submissionRepository.deleteAllByStudentId(userId);
    auditLogger.logSuccess("USER_DATA_CLEANUP", "USER", userId.toString());
  }

  @Transactional
  public Submission submitAssignment(UUID assignmentId, UUID studentId, SubmitAssignmentRequest request) {
    Assignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

    Submission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId)
        .orElse(Submission.builder()
            .id(UUID.randomUUID())
            .assignment(assignment)
            .studentId(studentId)
            .build());

    submission.setContent(request.getContent());
    submission.setStatus(Submission.SubmissionStatus.SUBMITTED);
    Submission saved = submissionRepository.save(submission);

    // Notify via Kafka
    kafkaTemplate.send("assignment.events", saved.getId().toString(), EventEnvelope.of(
        "SubmissionReceived",
        saved.getId().toString(),
        Map.of("assignmentId", assignmentId, "studentId", studentId),
        null));

    return saved;
  }

  @Transactional
  public Grade gradeSubmission(UUID submissionId, UUID instructorId, Set<String> roles,
      GradeSubmissionRequest request) {
    Submission submission = submissionRepository.findById(submissionId)
        .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

    // Only instructor of course or admin can grade
    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR")
            && courseServiceClient.isUserInstructor(submission.getAssignment().getCourseId(), instructorId))) {
      throw new ForbiddenException("Not authorized to grade submissions for this course");
    }

    if (request.getScore() > submission.getAssignment().getMaxScore()) {
      throw new IllegalArgumentException("Score cannot exceed max score");
    }

    Grade grade = gradeRepository.findBySubmissionId(submissionId)
        .orElse(Grade.builder()
            .id(UUID.randomUUID())
            .submission(submission)
            .build());

    grade.setScore(request.getScore());
    grade.setFeedback(request.getFeedback());
    grade.setInstructorId(instructorId);
    Grade saved = gradeRepository.save(grade);

    submission.setStatus(Submission.SubmissionStatus.GRADED);
    submissionRepository.save(submission);

    // Notify via Kafka
    kafkaTemplate.send("assignment.events", saved.getId().toString(), EventEnvelope.of(
        "AssignmentGraded",
        saved.getId().toString(),
        Map.of("submissionId", submissionId, "score", saved.getScore()),
        null));

    auditLogger.logSuccess("SUBMISSION_GRADE", "SUBMISSION", submissionId.toString(),
        Map.of("score", saved.getScore()));
    return saved;
  }

  @Transactional(readOnly = true)
  public List<Assignment> getAllAssignments() {
    return assignmentRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Assignment getAssignmentById(UUID id) {
    return assignmentRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
  }

  @Transactional(readOnly = true)
  public List<Assignment> getAssignmentsByCourse(UUID courseId) {
    return assignmentRepository.findByCourseId(courseId);
  }

  @Transactional(readOnly = true)
  public List<Submission> getSubmissionsByAssignment(UUID assignmentId, UUID userId, Set<String> roles) {
    Assignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

    // Only instructor or admin can see all submissions
    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(assignment.getCourseId(), userId))) {
      // Students can only see their own submissions
      return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, userId)
          .map(List::of)
          .orElse(List.of());
    }

    return submissionRepository.findByAssignmentId(assignmentId);
  }
}
