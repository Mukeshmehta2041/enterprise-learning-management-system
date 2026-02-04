package com.lms.enrollment.application;

import com.lms.enrollment.api.*;
import com.lms.enrollment.client.CourseServiceClient;
import com.lms.enrollment.domain.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnrollmentApplicationService {

  private static final Logger log = LoggerFactory.getLogger(EnrollmentApplicationService.class);
  private static final int DEFAULT_PAGE_SIZE = 20;

  private final EnrollmentRepository enrollmentRepository;
  private final LessonProgressRepository lessonProgressRepository;
  private final CourseServiceClient courseServiceClient;

  public EnrollmentApplicationService(
      EnrollmentRepository enrollmentRepository,
      LessonProgressRepository lessonProgressRepository,
      CourseServiceClient courseServiceClient) {
    this.enrollmentRepository = enrollmentRepository;
    this.lessonProgressRepository = lessonProgressRepository;
    this.courseServiceClient = courseServiceClient;
  }

  public EnrollmentResponse enroll(UUID userId, EnrollRequest request) {
    UUID courseId = request.courseId();

    // Check if already enrolled
    if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
      throw new ConflictException("User already enrolled in this course");
    }

    // Validate course exists and is published
    if (!courseServiceClient.isCoursePublished(courseId)) {
      throw new BadRequestException("Course not found or not published");
    }

    UUID enrollmentId = UUID.randomUUID();
    Enrollment enrollment = new Enrollment(enrollmentId, userId, courseId);

    Enrollment saved = enrollmentRepository.save(enrollment);
    log.info("User {} enrolled in course {}", userId, courseId);

    return mapToEnrollmentResponse(saved);
  }

  @Transactional(readOnly = true)
  public EnrollmentListResponse getMyEnrollments(UUID userId, Integer limit) {
    int pageSize = limit != null ? limit : DEFAULT_PAGE_SIZE;
    Pageable pageable = PageRequest.of(0, pageSize, Sort.by("enrolledAt").descending());

    Page<Enrollment> page = enrollmentRepository.findByUserId(userId, pageable);

    List<EnrollmentResponse> items = page.getContent().stream()
        .map(this::mapToEnrollmentResponse)
        .collect(Collectors.toList());

    String nextCursor = page.hasNext() ? String.valueOf(page.getNumber() + 1) : null;
    return new EnrollmentListResponse(items, nextCursor);
  }

  @Transactional(readOnly = true)
  public EnrollmentResponse getEnrollment(UUID enrollmentId, UUID userId, Set<String> roles) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

    // Check ownership or admin
    if (!enrollment.getUserId().equals(userId) && !roles.contains("ADMIN")) {
      throw new ForbiddenException("Not authorized to view this enrollment");
    }

    return mapToEnrollmentResponse(enrollment);
  }

  public void updateProgress(UUID enrollmentId, UpdateProgressRequest request, UUID userId) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

    if (!enrollment.getUserId().equals(userId)) {
      throw new ForbiddenException("Not authorized to update this enrollment");
    }

    LessonProgress progress = lessonProgressRepository
        .findByEnrollmentIdAndLessonId(enrollmentId, request.lessonId())
        .orElseGet(() -> new LessonProgress(UUID.randomUUID(), enrollment, request.lessonId()));

    if (Boolean.TRUE.equals(request.completed())) {
      progress.markCompleted();
    }

    lessonProgressRepository.save(progress);

    // Update aggregate progress
    int totalLessons = courseServiceClient.getTotalLessons(enrollment.getCourseId());
    long completedLessons = lessonProgressRepository.countByEnrollmentIdAndCompletedTrue(enrollmentId);

    enrollment.updateProgress((int) completedLessons, totalLessons);
    enrollmentRepository.save(enrollment);

    log.info("Progress updated for enrollment {}: {}/{} lessons", enrollmentId, completedLessons, totalLessons);
  }

  private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment) {
    return new EnrollmentResponse(
        enrollment.getId(),
        enrollment.getUserId(),
        enrollment.getCourseId(),
        enrollment.getStatus().name(),
        enrollment.getProgressPct(),
        enrollment.getEnrolledAt(),
        enrollment.getCompletedAt());
  }

  public static class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
      super(message);
    }
  }

  public static class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
      super(message);
    }
  }

  public static class ConflictException extends RuntimeException {
    public ConflictException(String message) {
      super(message);
    }
  }

  public static class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
      super(message);
    }
  }
}
