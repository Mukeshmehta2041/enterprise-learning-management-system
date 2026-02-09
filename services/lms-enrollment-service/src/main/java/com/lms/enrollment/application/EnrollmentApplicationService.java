package com.lms.enrollment.application;

import com.lms.enrollment.api.*;
import com.lms.enrollment.client.CourseServiceClient;
import com.lms.enrollment.domain.*;
import com.lms.enrollment.infrastructure.EnrollmentEventPublisher;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.exception.ResourceNotFoundException;
import com.lms.common.audit.AuditLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
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
  private final StringRedisTemplate redisTemplate;
  private final AuditLogger auditLogger;
  private final EnrollmentEventPublisher eventPublisher;

  @Value("${lms.enrollment.max-per-user:10}")
  private int maxEnrollmentsPerUser;

  public EnrollmentApplicationService(
      EnrollmentRepository enrollmentRepository,
      LessonProgressRepository lessonProgressRepository,
      CourseServiceClient courseServiceClient,
      StringRedisTemplate redisTemplate,
      AuditLogger auditLogger,
      EnrollmentEventPublisher eventPublisher) {
    this.enrollmentRepository = enrollmentRepository;
    this.lessonProgressRepository = lessonProgressRepository;
    this.courseServiceClient = courseServiceClient;
    this.redisTemplate = redisTemplate;
    this.auditLogger = auditLogger;
    this.eventPublisher = eventPublisher;
  }

  public EnrollmentResponse enroll(UUID userId, EnrollRequest request) {
    UUID courseId = request.courseId();
    String lockKey = String.format("lock:enrollment:%s:%s", courseId, userId);

    Boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, "locked", Duration.ofSeconds(10));
    if (acquired == null || !acquired) {
      throw new ConflictException("Enrollment in progress. Please wait.");
    }

    try {
      // Check enrollment quota
      long currentCount = enrollmentRepository.countByUserId(userId);
      if (currentCount >= maxEnrollmentsPerUser) {
        log.warn("User {} exceeded enrollment quota ({} / {})", userId, currentCount, maxEnrollmentsPerUser);
        throw new ForbiddenException("Enrollment quota exceeded. Max allowed: " + maxEnrollmentsPerUser);
      }

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
      auditLogger.logSuccess("COURSE_ENROLL", "ENROLLMENT", saved.getId().toString(), Map.of("courseId", courseId));

      eventPublisher.publishEnrollmentCreated(saved.getId(), saved.getUserId(), saved.getCourseId());

      return mapToEnrollmentResponse(saved);
    } finally {
      redisTemplate.delete(lockKey);
    }
  }

  @Transactional(readOnly = true)
  public EnrollmentListResponse getMyEnrollments(UUID userId, String cursor, Integer limit) {
    int pageSize = limit != null ? limit : DEFAULT_PAGE_SIZE;

    Instant cursorTime = (cursor != null && !cursor.isBlank())
        ? Instant.parse(cursor)
        : Instant.now().plusSeconds(60);

    List<Enrollment> enrollments = enrollmentRepository.findByUserIdAndEnrolledAtLessThanOrderByEnrolledAtDesc(userId,
        cursorTime, PageRequest.of(0, pageSize + 1));

    boolean hasNext = enrollments.size() > pageSize;
    List<Enrollment> resultList = hasNext ? enrollments.subList(0, pageSize) : enrollments;

    List<EnrollmentResponse> content = resultList.stream()
        .map(this::mapToEnrollmentResponse)
        .collect(Collectors.toList());

    String nextCursor = hasNext ? resultList.get(resultList.size() - 1).getEnrolledAt().toString() : null;
    long totalElements = enrollmentRepository.countByUserId(userId);
    int totalPages = (int) Math.ceil((double) totalElements / pageSize);

    return new EnrollmentListResponse(content, nextCursor, totalElements, totalPages);
  }

  public void cleanupUserData(UUID userId) {
    log.info("Cleaning up data for user: {}", userId);
    List<Enrollment> enrollments = enrollmentRepository.findAllByUserId(userId);
    for (Enrollment enrollment : enrollments) {
      lessonProgressRepository.deleteByEnrollmentId(enrollment.getId());
    }
    enrollmentRepository.deleteByUserId(userId);

    // Cleanup Redis
    String cacheKey = "user:enrollments:" + userId;
    redisTemplate.delete(cacheKey);
    auditLogger.logSuccess("USER_DATA_CLEANUP", "USER", userId.toString());
  }

  @Transactional(readOnly = true)
  public EnrollmentListResponse listEnrollmentsByCourse(UUID courseId, UUID userId, Set<String> roles, String cursor,
      Integer limit) {
    // Only instructor of the course or admin can list all enrollments
    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(courseId, userId))) {
      throw new ForbiddenException("Not authorized to list enrollments for this course");
    }

    int pageSize = limit != null ? limit : DEFAULT_PAGE_SIZE;
    Instant cursorTime = (cursor != null && !cursor.isBlank())
        ? Instant.parse(cursor)
        : Instant.now().plusSeconds(60);

    List<Enrollment> enrollments = enrollmentRepository.findByCourseIdAndEnrolledAtLessThanOrderByEnrolledAtDesc(
        courseId,
        cursorTime, PageRequest.of(0, pageSize + 1));

    boolean hasNext = enrollments.size() > pageSize;
    List<Enrollment> resultList = hasNext ? enrollments.subList(0, pageSize) : enrollments;

    List<EnrollmentResponse> content = resultList.stream()
        .map(this::mapToEnrollmentResponse)
        .collect(Collectors.toList());

    String nextCursor = hasNext ? resultList.get(resultList.size() - 1).getEnrolledAt().toString() : null;
    long totalElements = enrollmentRepository.countByCourseId(courseId);
    int totalPages = (int) Math.ceil((double) totalElements / pageSize);

    return new EnrollmentListResponse(content, nextCursor, totalElements, totalPages);
  }

  @Transactional(readOnly = true)
  public EnrollmentResponse getEnrollment(UUID enrollmentId, UUID userId, Set<String> roles) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

    // Check ownership
    if (enrollment.getUserId().equals(userId)) {
      return mapToEnrollmentResponse(enrollment);
    }

    // Check admin
    if (roles.contains("ADMIN")) {
      return mapToEnrollmentResponse(enrollment);
    }

    // Check instructor
    if (roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(enrollment.getCourseId(), userId)) {
      return mapToEnrollmentResponse(enrollment);
    }

    throw new ForbiddenException("Not authorized to view this enrollment");
  }

  public void updateProgress(UUID enrollmentId, UpdateProgressRequest request, UUID userId, Set<String> roles) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

    boolean isOwner = enrollment.getUserId().equals(userId);
    boolean isInstructor = roles.contains("INSTRUCTOR")
        && courseServiceClient.isUserInstructor(enrollment.getCourseId(), userId);
    boolean isAdmin = roles.contains("ADMIN");

    if (!isOwner && !isInstructor && !isAdmin) {
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
    auditLogger.logSuccess("COURSE_PROGRESS_UPDATE", "ENROLLMENT", enrollmentId.toString(),
        Map.of("lessonsCompleted", completedLessons, "totalLessons", totalLessons));
  }

  private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment) {
    var course = courseServiceClient.getCourse(enrollment.getCourseId());
    return new EnrollmentResponse(
        enrollment.getId(),
        enrollment.getCourseId(),
        course.title(),
        course.thumbnailUrl(),
        enrollment.getUserId(),
        enrollment.getStatus().name(),
        enrollment.getProgressPct(),
        enrollment.getEnrolledAt(),
        enrollment.getCompletedAt(),
        enrollment.getUpdatedAt());
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
