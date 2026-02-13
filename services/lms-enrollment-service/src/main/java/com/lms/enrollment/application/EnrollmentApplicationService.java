package com.lms.enrollment.application;

import com.lms.enrollment.api.*;
import com.lms.enrollment.client.AssignmentServiceClient;
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

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
  private final AssignmentCompletionRepository assignmentCompletionRepository;
  private final CourseServiceClient courseServiceClient;
  private final AssignmentServiceClient assignmentServiceClient;
  private final StringRedisTemplate redisTemplate;
  private final AuditLogger auditLogger;
  private final EnrollmentEventPublisher eventPublisher;

  @Value("${lms.enrollment.max-per-user:10}")
  private int maxEnrollmentsPerUser;

  public EnrollmentApplicationService(
      EnrollmentRepository enrollmentRepository,
      LessonProgressRepository lessonProgressRepository,
      AssignmentCompletionRepository assignmentCompletionRepository,
      CourseServiceClient courseServiceClient,
      AssignmentServiceClient assignmentServiceClient,
      StringRedisTemplate redisTemplate,
      AuditLogger auditLogger,
      EnrollmentEventPublisher eventPublisher) {
    this.enrollmentRepository = enrollmentRepository;
    this.lessonProgressRepository = lessonProgressRepository;
    this.assignmentCompletionRepository = assignmentCompletionRepository;
    this.courseServiceClient = courseServiceClient;
    this.assignmentServiceClient = assignmentServiceClient;
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
      CourseServiceClient.CourseResponse course = courseServiceClient.getCourse(courseId);
      if (course == null || !"PUBLISHED".equalsIgnoreCase(course.status())) {
        throw new BadRequestException("Course not found or not published");
      }

      UUID enrollmentId = UUID.randomUUID();
      Enrollment enrollment = new Enrollment(enrollmentId, userId, courseId);

      // Day 16: Handle Paid vs Free
      if (course.isFree() != null && !course.isFree()) {
        log.info("Creating pending enrollment for paid course: {}", courseId);
        enrollment.setStatus(EnrollmentStatus.PENDING_PAYMENT);
      } else {
        enrollment.setStatus(EnrollmentStatus.ENROLLED);
      }

      Enrollment saved = enrollmentRepository.save(enrollment);
      log.info("User {} enrolled in course {}", userId, courseId);
      auditLogger.logSuccess("COURSE_ENROLL", "ENROLLMENT", saved.getId().toString(), Map.of("courseId", courseId));

      eventPublisher.publishEnrollmentCreated(saved.getId(), saved.getUserId(), saved.getCourseId());

      return mapToEnrollmentResponse(saved);
    } finally {
      redisTemplate.delete(lockKey);
    }
  }

  @Transactional
  public void activateEnrollment(UUID userId, UUID courseId) {
    enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
        .ifPresent(enrollment -> {
          if (enrollment.getStatus() == EnrollmentStatus.PENDING_PAYMENT) {
            enrollment.setStatus(EnrollmentStatus.ENROLLED);
            enrollmentRepository.save(enrollment);
            log.info("Activated enrollment for user {} and course {}", userId, courseId);
            auditLogger.logSuccess("ENROLLMENT_ACTIVATE", "ENROLLMENT", enrollment.getId().toString());
          }
        });
  }

  @Transactional(readOnly = true)
  public EntitlementResponse getEntitlement(UUID userId, UUID courseId) {
    Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);

    CourseServiceClient.CourseResponse course = courseServiceClient.getCourse(courseId);

    if (enrollmentOpt.isPresent()) {
      Enrollment enrollment = enrollmentOpt.get();
      if (enrollment.getStatus() == EnrollmentStatus.ENROLLED) {
        return new EntitlementResponse(userId, courseId, EntitlementResponse.AccessLevel.FULL, true, "Enrolled");
      } else if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
        return new EntitlementResponse(userId, courseId, EntitlementResponse.AccessLevel.FULL, true, "Completed");
      } else if (enrollment.getStatus() == EnrollmentStatus.PENDING_PAYMENT) {
        return new EntitlementResponse(userId, courseId, EntitlementResponse.AccessLevel.PREVIEW, true,
            "Enrolled (Pending Payment)");
      }
    }

    if (course != null) {
      if (course.isFree() != null && course.isFree()) {
        return new EntitlementResponse(userId, courseId, EntitlementResponse.AccessLevel.FULL, false, "Free course");
      }
      return new EntitlementResponse(userId, courseId, EntitlementResponse.AccessLevel.PREVIEW, false,
          "Paid course, not enrolled");
    }

    return new EntitlementResponse(userId, courseId, EntitlementResponse.AccessLevel.NONE, false, "Course not found");
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

  @Transactional(readOnly = true)
  public List<Enrollment> getEnrollmentsByUserId(UUID userId) {
    return enrollmentRepository.findAllByUserId(userId);
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

  @Transactional(readOnly = true)
  public EnrollmentResponse getMyEnrollmentByCourse(UUID userId, UUID courseId) {
    Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
        .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for this course"));
    return mapToEnrollmentResponse(enrollment);
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

    if (request.positionSecs() != null) {
      progress.setLastPositionSecs(request.positionSecs());
    }

    lessonProgressRepository.save(progress);

    recalculateProgress(enrollment, request.lessonId());
  }

  @Transactional
  public void recordAssignmentCompletion(UUID enrollmentId, UUID assignmentId, UUID lessonId) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
        .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

    if (!assignmentCompletionRepository.existsByEnrollmentIdAndAssignmentId(enrollmentId, assignmentId)) {
      AssignmentCompletion completion = AssignmentCompletion.builder()
          .id(UUID.randomUUID())
          .enrollment(enrollment)
          .assignmentId(assignmentId)
          .lessonId(lessonId)
          .completedAt(Instant.now())
          .build();
      assignmentCompletionRepository.save(completion);
      log.info("Recorded assignment completion for assignment {} in enrollment {}", assignmentId, enrollmentId);
    }

    recalculateProgress(enrollment, lessonId);
  }

  private void recalculateProgress(Enrollment enrollment, UUID lastLessonId) {
    UUID enrollmentId = enrollment.getId();
    UUID courseId = enrollment.getCourseId();

    // Fetch course requirements
    CourseServiceClient.CourseDetailResponse course = courseServiceClient.getCourseDetail(courseId);
    int totalLessons = 0;
    if (course != null && course.modules() != null) {
      totalLessons = course.modules().stream()
          .filter(m -> m.lessons() != null)
          .mapToInt(m -> m.lessons().size())
          .sum();
    }

    BigDecimal threshold = (course != null && course.completionThreshold() != null)
        ? course.completionThreshold()
        : new BigDecimal("100.00");

    boolean requireAssignments = course != null && Boolean.TRUE.equals(course.requireAllAssignments());

    // Fetch assignment requirements
    List<AssignmentServiceClient.AssignmentSummary> assignments = assignmentServiceClient
        .getAssignmentsForCourse(courseId);
    long totalMandatory = assignments.stream().filter(AssignmentServiceClient.AssignmentSummary::isMandatory).count();

    // Current status
    long completedLessons = lessonProgressRepository.countByEnrollmentIdAndCompletedTrue(enrollmentId);
    List<AssignmentCompletion> completedAssignments = assignmentCompletionRepository
        .findAllByEnrollmentId(enrollmentId);

    long completedMandatoryCount = assignments.stream()
        .filter(AssignmentServiceClient.AssignmentSummary::isMandatory)
        .filter(a -> completedAssignments.stream().anyMatch(ca -> ca.getAssignmentId().equals(a.id())))
        .count();

    if (lastLessonId != null) {
      enrollment.setLastLessonId(lastLessonId);
    }

    enrollment.updateProgress(
        (int) completedLessons,
        totalLessons,
        threshold,
        requireAssignments,
        completedMandatoryCount,
        totalMandatory);

    enrollmentRepository.save(enrollment);

    log.info("Progress updated for enrollment {}: {}/{} lessons, {}/{} mandatory assignments. Progress: {}%",
        enrollmentId, completedLessons, totalLessons, completedMandatoryCount, totalMandatory,
        enrollment.getProgressPct());

    auditLogger.logSuccess("COURSE_PROGRESS_UPDATE", "ENROLLMENT", enrollmentId.toString(),
        Map.of("lessonsCompleted", completedLessons, "totalLessons", totalLessons,
            "assignmentsCompleted", completedMandatoryCount));
  }

  private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment) {
    var course = courseServiceClient.getCourse(enrollment.getCourseId());

    List<UUID> completedLessonIds = enrollment.getLessonProgress().stream()
        .filter(LessonProgress::isCompleted)
        .map(LessonProgress::getLessonId)
        .collect(Collectors.toList());

    Map<UUID, Integer> lessonPositions = enrollment.getLessonProgress().stream()
        .filter(lp -> lp.getLastPositionSecs() != null)
        .collect(Collectors.toMap(
            LessonProgress::getLessonId,
            lp -> lp.getLastPositionSecs().intValue(),
            (v1, v2) -> v1 // Handle duplicates if any, though lessonId should be unique
        ));

    return new EnrollmentResponse(
        enrollment.getId(),
        enrollment.getCourseId(),
        course.title(),
        course.thumbnailUrl(),
        enrollment.getUserId(),
        enrollment.getStatus().name(),
        enrollment.getProgressPct(),
        completedLessonIds,
        lessonPositions,
        enrollment.getLastLessonId(),
        enrollment.getEnrolledAt(),
        enrollment.getCompletedAt(),
        enrollment.getUpdatedAt());
  }

  public boolean isUserEnrolled(UUID userId, UUID courseId) {
    return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
        .map(e -> e.getStatus() == EnrollmentStatus.ENROLLED
            || e.getStatus() == EnrollmentStatus.IN_PROGRESS
            || e.getStatus() == EnrollmentStatus.COMPLETED)
        .orElse(false);
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
