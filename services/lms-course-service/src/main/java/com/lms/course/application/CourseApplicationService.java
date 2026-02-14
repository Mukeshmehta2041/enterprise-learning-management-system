package com.lms.course.application;

import com.lms.course.api.*;
import com.lms.course.domain.*;
import com.lms.course.infrastructure.CourseEventPublisher;
import com.lms.common.exception.BadRequestException;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.exception.ResourceNotFoundException;
import com.lms.common.audit.AuditLogger;
import com.lms.common.features.FeatureFlagService;
import com.lms.course.infrastructure.EnrollmentServiceClient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseApplicationService {

  private static final Logger log = LoggerFactory.getLogger(CourseApplicationService.class);
  private static final int DEFAULT_PAGE_SIZE = 20;
  private static final int MAX_PAGE_SIZE = 100;

  private final CourseRepository courseRepository;
  private final CourseModuleRepository moduleRepository;
  private final LessonRepository lessonRepository;
  private final CourseInstructorRepository instructorRepository;
  private final CourseCacheService courseCacheService;
  private final CourseEventPublisher courseEventPublisher;
  private final AuditLogger auditLogger;
  private final FeatureFlagService featureFlagService;
  private final EnrollmentServiceClient enrollmentServiceClient;

  @Value("${lms.course.max-total:100}")
  private int maxTotalCourses;

  public CourseApplicationService(CourseRepository courseRepository,
      CourseModuleRepository moduleRepository,
      LessonRepository lessonRepository,
      CourseInstructorRepository instructorRepository,
      CourseCacheService courseCacheService,
      CourseEventPublisher courseEventPublisher,
      AuditLogger auditLogger,
      FeatureFlagService featureFlagService,
      EnrollmentServiceClient enrollmentServiceClient) {
    this.courseRepository = courseRepository;
    this.moduleRepository = moduleRepository;
    this.lessonRepository = lessonRepository;
    this.instructorRepository = instructorRepository;
    this.courseCacheService = courseCacheService;
    this.courseEventPublisher = courseEventPublisher;
    this.auditLogger = auditLogger;
    this.featureFlagService = featureFlagService;
    this.enrollmentServiceClient = enrollmentServiceClient;
  }

  public void cleanupUserData(UUID userId) {
    log.info("Cleaning up course data for user: {}", userId);
    instructorRepository.deleteByUserId(userId);
    // If we had reviews or ratings, we'd delete them here too
    auditLogger.logSuccess("USER_DATA_CLEANUP", "USER", userId.toString());
  }

  @Transactional
  public void bulkUpdateStatus(List<UUID> courseIds, CourseStatus status, UUID adminId) {
    List<Course> courses = courseRepository.findAllById(courseIds);
    for (Course course : courses) {
      CourseStatus oldStatus = course.getStatus();
      course.setStatus(status);
      courseRepository.save(course);

      courseEventPublisher.publishCourseUpdated(course);
      auditLogger.logSuccess("COURSE_MODERATION", "COURSE", course.getId().toString(),
          Map.of("oldStatus", oldStatus, "newStatus", status, "adminId", adminId));
    }
  }

  @Transactional
  public CourseResponse duplicateCourse(UUID courseId, UUID userId, Set<String> roles) {
    Course original = courseRepository.findById(courseId)
        .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

    if (!roles.contains("ADMIN") && !original.getInstructors().stream()
        .anyMatch(i -> i.getUserId().equals(userId))) {
      throw new ForbiddenException("Not authorized to duplicate this course");
    }

    // Clone basic info
    Course duplicate = Course.builder()
        .id(UUID.randomUUID())
        .title("Copy of " + original.getTitle())
        .description(original.getDescription())
        .thumbnailUrl(original.getThumbnailUrl())
        .category(original.getCategory())
        .level(original.getLevel())
        .price(original.getPrice())
        .status(CourseStatus.DRAFT)
        .isFeatured(false)
        .isTrending(false)
        .tags(new HashSet<>(original.getTags()))
        .build();

    // Re-link instructors (or just the current user)
    CourseInstructor instructor = new CourseInstructor(duplicate, userId, "INSTRUCTOR");
    duplicate.getInstructors().add(instructor);

    Course saved = courseRepository.save(duplicate);

    // Deep copy modules and lessons
    for (CourseModule originalModule : original.getModules()) {
      CourseModule duplicateModule = new CourseModule(
          UUID.randomUUID(),
          saved,
          originalModule.getTitle(),
          originalModule.getSortOrder());
      duplicateModule.setSortOrder(originalModule.getSortOrder());
      CourseModule savedModule = moduleRepository.save(duplicateModule);

      for (Lesson originalLesson : originalModule.getLessons()) {
        Lesson duplicateLesson = new Lesson(
            UUID.randomUUID(),
            savedModule,
            originalLesson.getTitle(),
            originalLesson.getType(),
            originalLesson.getDurationMinutes(),
            originalLesson.getSortOrder());
        duplicateLesson.setPreview(originalLesson.isPreview());
        duplicateLesson.setStatus(LessonStatus.DRAFT);
        lessonRepository.save(duplicateLesson);
      }
    }

    auditLogger.logSuccess("COURSE_DUPLICATE", "COURSE", saved.getId().toString(),
        Map.of("originalId", courseId));
    return mapToCourseResponse(saved);
  }

  @Transactional(readOnly = true)
  public CourseListResponse listCourses(
      CourseStatus status, String category, String level, String search,
      Boolean isFeatured, Boolean isTrending, List<String> tags,
      String sort, String order,
      String cursor, Integer limit, Integer page,
      UUID currentUserId,
      Set<String> roles) {

    int pageSize = limit != null ? Math.min(limit, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
    int pageNumber = (page != null && page > 0) ? page : 1;

    Specification<Course> spec = (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Ensure distinct results because of joins
      if (query.getResultType() != Long.class) {
        query.distinct(true);
      }

      // Status filtering based on roles
      if (status != null) {
        predicates.add(cb.equal(root.get("status"), status));
      } else if (!roles.contains("ADMIN")) {
        // Students and non-logged-in users only see PUBLISHED
        // Instructors see PUBLISHED + their own courses
        if (roles.contains("INSTRUCTOR") && currentUserId != null) {
          predicates.add(cb.or(
              cb.equal(root.get("status"), CourseStatus.PUBLISHED),
              cb.equal(root.join("instructors", jakarta.persistence.criteria.JoinType.LEFT)
                  .get("userId"),
                  currentUserId)));
        } else {
          predicates.add(cb.equal(root.get("status"), CourseStatus.PUBLISHED));
        }
      }

      if (category != null && !category.isBlank()) {
        predicates.add(cb.equal(cb.upper(root.get("category")), category.toUpperCase()));
      }

      if (level != null && !level.isBlank()) {
        predicates.add(cb.equal(cb.upper(root.get("level")), level.toUpperCase()));
      }

      if (isFeatured != null) {
        predicates.add(cb.equal(root.get("isFeatured"), isFeatured));
      }

      if (isTrending != null) {
        predicates.add(cb.equal(root.get("isTrending"), isTrending));
      }

      if (tags != null && !tags.isEmpty()) {
        for (String tag : tags) {
          predicates.add(cb.isMember(tag, root.get("tags")));
        }
      }

      if (search != null && !search.isBlank()) {
        String searchPattern = "%" + search.toLowerCase() + "%";
        predicates.add(cb.or(
            cb.like(cb.lower(root.get("title")), searchPattern),
            cb.like(cb.lower(root.get("description")), searchPattern)));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };

    String sortField = (sort != null && !sort.isBlank()) ? sort : "createdAt";
    Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
    Pageable pageable = PageRequest.of(pageNumber - 1, pageSize, Sort.by(direction, sortField));

    Page<Course> coursePage = courseRepository.findAll(spec, pageable);

    List<CourseResponse> content = coursePage.getContent().stream()
        .map(this::mapToCourseResponse)
        .collect(Collectors.toList());

    return new CourseListResponse(
        content,
        null, // Pagination via page numbers for now as it's easier with Specification
        coursePage.getTotalElements(),
        coursePage.getTotalPages(),
        pageSize,
        pageNumber);
  }

  @Transactional(readOnly = true)
  public CourseListResponse listMyCourses(String cursor, Integer limit, Integer page, UUID currentUserId) {
    int pageSize = limit != null ? Math.min(limit, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
    int pageNumber = (page != null && page > 0) ? page : 1;
    Instant cursorTime = (cursor != null && !cursor.isBlank())
        ? Instant.parse(cursor)
        : Instant.now().plusSeconds(60);

    List<Course> courses = courseRepository.findByInstructorId(currentUserId, cursorTime,
        PageRequest.of(0, pageSize + 1));

    boolean hasNext = courses.size() > pageSize;
    List<Course> resultList = hasNext ? courses.subList(0, pageSize) : courses;

    List<CourseResponse> content = resultList.stream()
        .map(this::mapToCourseResponse)
        .collect(Collectors.toList());

    String nextCursor = hasNext ? resultList.get(resultList.size() - 1).getCreatedAt().toString() : null;

    long totalElements = instructorRepository.countByUserId(currentUserId);
    int totalPages = (int) Math.ceil((double) totalElements / pageSize);

    return new CourseListResponse(content, nextCursor, totalElements, totalPages, pageSize, pageNumber);
  }

  @Transactional(readOnly = true)
  public CourseDetailResponse getCourseById(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canViewCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("No access to this course");
    }

    boolean hasAccess = roles.contains("ADMIN") || courseRepository.isUserInstructor(courseId, currentUserId);
    if (!hasAccess && currentUserId != null) {
      hasAccess = enrollmentServiceClient.isUserEnrolled(currentUserId, courseId);
    }

    // Day 16: Free courses grant access to all lessons even without enrollment
    if (!hasAccess && course.isFree()) {
      hasAccess = true;
    }

    return mapToCourseDetailResponse(course, hasAccess);
  }

  public CourseDetailResponse createCourse(CreateCourseRequest request, UUID currentUserId, Set<String> roles) {
    if (!featureFlagService.isEnabled("course-creation-enabled")) {
      throw new ForbiddenException("Course creation is temporarily disabled");
    }

    // Check system-wide course quota
    long currentCount = courseRepository.count();
    if (currentCount >= maxTotalCourses) {
      log.warn("System course quota exceeded ({} / {})", currentCount, maxTotalCourses);
      throw new ForbiddenException("System course quota exceeded. Contact support.");
    }

    // Only instructors and admins can create courses
    if (!roles.contains("INSTRUCTOR") && !roles.contains("ADMIN")) {
      throw new ForbiddenException("Only instructors and admins can create courses");
    }

    // Generate slug from title if not provided
    String slug = request.slug() != null && !request.slug().isBlank()
        ? request.slug()
        : generateSlug(request.title());

    // Check if slug already exists
    if (courseRepository.existsBySlug(slug)) {
      throw new ConflictException("Course with slug '" + slug + "' already exists");
    }

    UUID courseId = request.id() != null ? request.id() : UUID.randomUUID();
    CourseStatus status = request.status() != null ? request.status() : CourseStatus.DRAFT;

    Course course = new Course(courseId, request.title(), slug, request.description(), status);
    course.setCategory(request.category());
    course.setLevel(request.level());
    course.setThumbnailUrl(request.thumbnailUrl());
    course.setPrice(request.price() != null ? request.price() : java.math.BigDecimal.ZERO);
    course.setCurrency(request.currency() != null ? request.currency() : "USD");
    course.setFree(
        request.isFree() != null ? request.isFree() : (course.getPrice().compareTo(java.math.BigDecimal.ZERO) == 0));
    course.setCompletionThreshold(request.completionThreshold() != null
        ? request.completionThreshold()
        : new java.math.BigDecimal("100.00"));
    course.setRequireAllAssignments(Boolean.TRUE.equals(request.requireAllAssignments()));

    // Add modules and lessons if provided
    if (request.modules() != null) {
      for (int i = 0; i < request.modules().size(); i++) {
        CreateModuleRequest modReq = request.modules().get(i);
        CourseModule module = new CourseModule(
            UUID.randomUUID(),
            course,
            modReq.title(),
            modReq.sortOrder() != null ? modReq.sortOrder() : i);

        if (modReq.lessons() != null) {
          for (int j = 0; j < modReq.lessons().size(); j++) {
            CreateLessonRequest lesReq = modReq.lessons().get(j);
            Lesson lesson = new Lesson(
                UUID.randomUUID(),
                module,
                lesReq.title(),
                lesReq.type(),
                lesReq.durationMinutes(),
                lesReq.sortOrder() != null ? lesReq.sortOrder() : j);
            module.addLesson(lesson);
          }
        }
        course.addModule(module);
      }
    }

    // Add creator as instructor
    CourseInstructor instructor = new CourseInstructor(course, currentUserId, "INSTRUCTOR");
    course.addInstructor(instructor);

    Course saved = courseRepository.save(course);
    courseEventPublisher.publishCourseCreated(saved);
    log.info("Course created: {} by user: {}", courseId, currentUserId);
    auditLogger.logSuccess("COURSE_CREATE", "COURSE", courseId.toString(), Map.of("title", saved.getTitle()));

    return mapToCourseDetailResponse(saved, true);
  }

  public CourseDetailResponse updateCourse(UUID courseId, UpdateCourseRequest request,
      UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    // Only course instructor or admin can update
    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to update this course");
    }

    if (request.title() != null) {
      course.setTitle(request.title());
    }
    if (request.description() != null) {
      course.setDescription(request.description());
    }
    if (request.category() != null) {
      course.setCategory(request.category());
    }
    if (request.level() != null) {
      course.setLevel(request.level());
    }
    if (request.price() != null) {
      course.setPrice(request.price());
    }
    if (request.currency() != null) {
      course.setCurrency(request.currency());
    }
    if (request.isFree() != null) {
      course.setFree(request.isFree());
    }
    if (request.completionThreshold() != null) {
      course.setCompletionThreshold(request.completionThreshold());
    }
    if (request.requireAllAssignments() != null) {
      course.setRequireAllAssignments(request.requireAllAssignments());
    }
    if (request.thumbnailUrl() != null) {
      course.setThumbnailUrl(request.thumbnailUrl());
    }
    if (request.status() != null) {
      course.setStatus(request.status());
    }

    Course updated = courseRepository.save(course);
    courseEventPublisher.publishCourseUpdated(updated);
    courseCacheService.evictCourse(courseId);
    log.info("Course updated: {} by user: {}", courseId, currentUserId);
    auditLogger.logSuccess("COURSE_UPDATE", "COURSE", courseId.toString(),
        Map.of("status", updated.getStatus().name()));

    return mapToCourseDetailResponse(updated, true);
  }

  public CourseDetailResponse publishCourse(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to publish this course");
    }

    course.setStatus(CourseStatus.PUBLISHED);
    Course updated = courseRepository.save(course);
    courseEventPublisher.publishCourseUpdated(updated);
    courseCacheService.evictCourse(courseId);
    auditLogger.logSuccess("COURSE_PUBLISH", "COURSE", courseId.toString());

    return mapToCourseDetailResponse(updated, true);
  }

  public CourseDetailResponse saveAsDraft(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to update this course");
    }

    course.setStatus(CourseStatus.DRAFT);
    Course updated = courseRepository.save(course);
    courseEventPublisher.publishCourseUpdated(updated);
    courseCacheService.evictCourse(courseId);
    auditLogger.logSuccess("COURSE_SAVE_DRAFT", "COURSE", courseId.toString());

    return mapToCourseDetailResponse(updated, true);
  }

  @Transactional
  public CourseDetailResponse updateCourseStatus(UUID courseId, CourseStatus status) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    CourseStatus oldStatus = course.getStatus();
    course.setStatus(status);
    Course updated = courseRepository.save(course);

    courseCacheService.evictCourse(courseId);
    auditLogger.logSuccess("COURSE_STATUS_MODERATE", "COURSE", courseId.toString(),
        Map.of("oldStatus", oldStatus, "newStatus", status));

    return mapToCourseDetailResponse(updated, true);
  }

  public void deleteCourse(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to delete this course");
    }

    courseRepository.delete(course);
    courseEventPublisher.publishCourseDeleted(courseId.toString());
    courseCacheService.evictCourse(courseId);
    log.info("Course deleted: {} by user: {}", courseId, currentUserId);
    auditLogger.logSuccess("COURSE_DELETE", "COURSE", courseId.toString());
  }

  public ModuleResponse createModule(UUID courseId, CreateModuleRequest request,
      UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    UUID moduleId = UUID.randomUUID();
    CourseModule module = new CourseModule(moduleId, course, request.title(), request.sortOrder());

    CourseModule saved = moduleRepository.save(module);
    log.info("Module created: {} in course: {}", moduleId, courseId);

    return mapToModuleResponse(saved, true);
  }

  public ModuleResponse updateModule(UUID courseId, UUID moduleId, UpdateModuleRequest request,
      UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    CourseModule module = moduleRepository.findById(moduleId)
        .orElseThrow(() -> new ResourceNotFoundException("Module not found: " + moduleId));

    if (request.title() != null) {
      module.setTitle(request.title());
    }
    if (request.sortOrder() != null) {
      module.setSortOrder(request.sortOrder());
    }

    CourseModule updated = moduleRepository.save(module);
    log.info("Module updated: {}", moduleId);

    return mapToModuleResponse(updated, true);
  }

  public void deleteModule(UUID courseId, UUID moduleId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    CourseModule module = moduleRepository.findById(moduleId)
        .orElseThrow(() -> new ResourceNotFoundException("Module not found: " + moduleId));

    if (!module.getCourse().getId().equals(courseId)) {
      throw new BadRequestException("Module does not belong to course");
    }

    moduleRepository.delete(module);
    courseEventPublisher.publishModuleDeleted(courseId.toString(), moduleId.toString());
    log.info("Module deleted: {}", moduleId);
  }

  public void reorderModules(UUID courseId, BulkReorderRequest request, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    for (BulkReorderRequest.ReorderItem item : request.items()) {
      CourseModule module = moduleRepository.findById(item.id())
          .orElseThrow(() -> new ResourceNotFoundException("Module not found: " + item.id()));

      if (!module.getCourse().getId().equals(courseId)) {
        throw new BadRequestException("Module " + item.id() + " does not belong to course");
      }

      module.setSortOrder(item.sortOrder());
      moduleRepository.save(module);
    }
    log.info("Modules reordered for course: {}", courseId);
  }

  public LessonResponse createLesson(UUID courseId, UUID moduleId, CreateLessonRequest request,
      UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    CourseModule module = moduleRepository.findById(moduleId)
        .orElseThrow(() -> new ResourceNotFoundException("Module not found: " + moduleId));

    UUID lessonId = UUID.randomUUID();
    Lesson lesson = new Lesson(lessonId, module, request.title(), request.type(),
        request.durationMinutes(), request.sortOrder());

    Lesson saved = lessonRepository.save(lesson);
    log.info("Lesson created: {} in module: {}", lessonId, moduleId);

    return mapToLessonResponse(saved, true);
  }

  public LessonResponse updateLesson(UUID courseId, UUID moduleId, UUID lessonId,
      UpdateLessonRequest request, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    Lesson lesson = lessonRepository.findById(lessonId)
        .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

    if (request.title() != null) {
      lesson.setTitle(request.title());
    }
    if (request.type() != null) {
      lesson.setType(request.type());
    }
    if (request.durationMinutes() != null) {
      lesson.setDurationMinutes(request.durationMinutes());
    }
    if (request.sortOrder() != null) {
      lesson.setSortOrder(request.sortOrder());
    }
    if (request.isPreview() != null) {
      lesson.setPreview(request.isPreview());
    }
    if (request.status() != null) {
      try {
        lesson.setStatus(LessonStatus.valueOf(request.status().toUpperCase()));
      } catch (IllegalArgumentException ex) {
        throw new BadRequestException("Invalid lesson status: " + request.status());
      }
    }

    Lesson updated = lessonRepository.save(lesson);
    log.info("Lesson updated: {}", lessonId);

    return mapToLessonResponse(updated, true);
  }

  @Transactional
  public void reorderLessons(UUID courseId, UUID moduleId, BulkReorderRequest request,
      UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    for (BulkReorderRequest.ReorderItem item : request.items()) {
      Lesson lesson = lessonRepository.findById(item.id())
          .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + item.id()));
      if (!lesson.getModule().getId().equals(moduleId)) {
        throw new BadRequestException("Lesson " + item.id() + " does not belong to module " + moduleId);
      }
      lesson.setSortOrder(item.sortOrder());
      lessonRepository.save(lesson);
    }
    log.info("Lessons reordered in module: {}", moduleId);
  }

  @Transactional
  public List<ModuleResponse> syncCurriculum(UUID courseId, SyncCurriculumRequest request, UUID currentUserId,
      Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    if (request.modules().size() > 50) {
      throw new BadRequestException("Course cannot have more than 50 modules");
    }

    // Map existing modules by ID
    Map<UUID, CourseModule> existingModules = course.getModules().stream()
        .collect(Collectors.toMap(CourseModule::getId, m -> m));

    Set<UUID> receivedModuleIds = new HashSet<>();

    for (int i = 0; i < request.modules().size(); i++) {
      var modReq = request.modules().get(i);
      CourseModule module;

      if (modReq.id() != null && existingModules.containsKey(modReq.id())) {
        module = existingModules.get(modReq.id());
        module.setTitle(modReq.title());
        module.setSortOrder(modReq.sortOrder() != null ? modReq.sortOrder() : i);
        receivedModuleIds.add(modReq.id());
      } else {
        UUID moduleId = modReq.id() != null ? modReq.id() : UUID.randomUUID();
        module = new CourseModule(moduleId, course, modReq.title(),
            modReq.sortOrder() != null ? modReq.sortOrder() : i);
        course.addModule(module);
        receivedModuleIds.add(moduleId);
      }

      if (modReq.lessons().size() > 100) {
        throw new BadRequestException("Module '" + modReq.title() + "' cannot have more than 100 lessons");
      }

      // Handle lessons in module
      Map<UUID, Lesson> existingLessons = module.getLessons().stream()
          .collect(Collectors.toMap(Lesson::getId, l -> l));
      Set<UUID> receivedLessonIds = new HashSet<>();

      for (int j = 0; j < modReq.lessons().size(); j++) {
        var lesReq = modReq.lessons().get(j);
        Lesson lesson;
        if (lesReq.id() != null && existingLessons.containsKey(lesReq.id())) {
          lesson = existingLessons.get(lesReq.id());
          String oldTitle = lesson.getTitle();
          lesson.setTitle(lesReq.title());
          lesson.setType(LessonType.valueOf(lesReq.type()));
          lesson.setDurationMinutes(lesReq.durationMinutes());
          lesson.setSortOrder(lesReq.sortOrder() != null ? lesReq.sortOrder() : j);
          lesson.setPreview(lesReq.isPreview());
          receivedLessonIds.add(lesReq.id());

          if (!oldTitle.equals(lesReq.title()) && course.getStatus() == CourseStatus.PUBLISHED) {
            courseEventPublisher.publishLessonUpdated(courseId, lesson.getId(), lesson.getTitle());
          }
        } else {
          UUID lessonId = lesReq.id() != null ? lesReq.id() : UUID.randomUUID();
          lesson = new Lesson(lessonId, module, lesReq.title(), LessonType.valueOf(lesReq.type()),
              lesReq.durationMinutes(), lesReq.sortOrder() != null ? lesReq.sortOrder() : j);
          lesson.setPreview(lesReq.isPreview());
          module.addLesson(lesson);
          receivedLessonIds.add(lessonId);

          if (course.getStatus() == CourseStatus.PUBLISHED) {
            courseEventPublisher.publishLessonPublished(courseId, lessonId, lesson.getTitle());
          }
        }
      }

      // Remove lessons not received
      module.getLessons().removeIf(l -> !receivedLessonIds.contains(l.getId()));
    }

    // Remove modules not received
    course.getModules().removeIf(m -> !receivedModuleIds.contains(m.getId()));

    Course saved = courseRepository.save(course);
    courseCacheService.evictCourse(courseId);

    return saved.getModules().stream()
        .map(m -> mapToModuleResponse(m, true))
        .collect(Collectors.toList());
  }

  @Transactional
  public void deleteLesson(UUID courseId, UUID moduleId, UUID lessonId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to modify this course");
    }

    Lesson lesson = lessonRepository.findById(lessonId)
        .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonId));

    if (!lesson.getModule().getId().equals(moduleId)) {
      throw new BadRequestException("Lesson does not belong to module");
    }

    lessonRepository.delete(lesson);
    courseEventPublisher.publishLessonDeleted(courseId.toString(), lessonId.toString());
    log.info("Lesson deleted: {}", lessonId);
  }

  @Transactional(readOnly = true)
  public List<ModuleResponse> getModulesByCourse(UUID courseId, UUID currentUserId, Set<String> roles) {
    CourseDetailResponse course = getCourseById(courseId, currentUserId, roles);
    return course.modules();
  }

  public boolean isUserInstructor(UUID courseId, UUID userId) {
    return courseRepository.isUserInstructor(courseId, userId);
  }

  public boolean isLessonPreview(UUID courseId, UUID lessonId) {
    return lessonRepository.findById(lessonId)
        .map(lesson -> lesson.isPreview() && lesson.getModule().getCourse().getId().equals(courseId))
        .orElse(false);
  }

  public boolean isFree(UUID courseId) {
    return courseRepository.findById(courseId)
        .map(Course::isFree)
        .orElse(false);
  }

  public CourseStatus getCourseStatus(UUID courseId) {
    return courseRepository.findById(courseId)
        .map(Course::getStatus)
        .orElse(CourseStatus.DRAFT);
  }

  public Instant getUpdatedAt(UUID courseId) {
    return courseRepository.findUpdatedAtById(courseId).orElse(null);
  }

  private boolean canViewCourse(CourseDetailResponse course, UUID currentUserId, Set<String> roles) {
    if (roles.contains("ADMIN")) {
      return true;
    }
    if ("PUBLISHED".equals(course.status())) {
      return true;
    }
    // Check if user is instructor
    return course.instructorIds().contains(currentUserId);
  }

  private boolean canViewCourse(Course course, UUID currentUserId, Set<String> roles) {
    if (roles.contains("ADMIN")) {
      return true;
    }
    if (course.getStatus() == CourseStatus.PUBLISHED) {
      return true;
    }
    // Check if user is instructor
    return courseRepository.isUserInstructor(course.getId(), currentUserId);
  }

  private boolean canModifyCourse(Course course, UUID currentUserId, Set<String> roles) {
    if (roles.contains("ADMIN")) {
      return true;
    }
    return courseRepository.isUserInstructor(course.getId(), currentUserId);
  }

  private String generateSlug(String title) {
    return title.toLowerCase()
        .replaceAll("[^a-z0-9\\s-]", "")
        .replaceAll("\\s+", "-")
        .replaceAll("-+", "-")
        .replaceAll("^-|-$", "");
  }

  private CourseResponse mapToCourseResponse(Course course) {
    if (course == null)
      return null;
    List<UUID> instructorIds = course.getInstructors() != null ? course.getInstructors().stream()
        .map(CourseInstructor::getUserId)
        .collect(Collectors.toList()) : List.of();

    return new CourseResponse(
        course.getId(),
        course.getTitle(),
        course.getSlug(),
        course.getDescription(),
        course.getCategory(),
        course.getLevel(),
        course.getPrice(),
        course.getCurrency(),
        course.isFree(),
        course.getThumbnailUrl(),
        course.getStatus() != null ? course.getStatus().name() : "DRAFT",
        course.isFeatured(),
        course.isTrending(),
        course.getCompletionThreshold(),
        course.isRequireAllAssignments(),
        course.getTags(),
        instructorIds,
        course.getCreatedAt(),
        course.getUpdatedAt());
  }

  private CourseDetailResponse mapToCourseDetailResponse(Course course, boolean hasAccess) {
    List<UUID> instructorIds = course.getInstructors().stream()
        .map(CourseInstructor::getUserId)
        .collect(Collectors.toList());

    List<ModuleResponse> modules = course.getModules().stream()
        .map(m -> mapToModuleResponse(m, hasAccess))
        .collect(Collectors.toList());

    return new CourseDetailResponse(
        course.getId(),
        course.getTitle(),
        course.getSlug(),
        course.getDescription(),
        course.getCategory(),
        course.getLevel(),
        course.getPrice(),
        course.getCurrency(),
        course.isFree(),
        course.getThumbnailUrl(),
        course.getStatus().name(),
        course.isFeatured(),
        course.isTrending(),
        course.getCompletionThreshold(),
        course.isRequireAllAssignments(),
        course.getTags(),
        modules,
        instructorIds,
        course.getCreatedAt(),
        course.getUpdatedAt());
  }

  private ModuleResponse mapToModuleResponse(CourseModule module, boolean hasAccess) {
    if (module == null)
      return null;
    List<LessonResponse> lessons = module.getLessons() != null ? module.getLessons().stream()
        .map(l -> mapToLessonResponse(l, hasAccess))
        .collect(Collectors.toList()) : List.of();

    return new ModuleResponse(
        module.getId(),
        module.getTitle(),
        module.getSortOrder(),
        lessons,
        module.getCreatedAt(),
        module.getUpdatedAt());
  }

  private LessonResponse mapToLessonResponse(Lesson lesson, boolean hasAccess) {
    if (lesson == null)
      return null;
    return new LessonResponse(
        lesson.getId(),
        lesson.getTitle(),
        lesson.getType() != null ? lesson.getType().name() : "VIDEO",
        lesson.getDurationMinutes(),
        lesson.getSortOrder(),
        lesson.isPreview(),
        lesson.isPreview() || hasAccess,
        lesson.getStatus() != null ? lesson.getStatus().name() : "PUBLISHED",
        lesson.getAvailableAt(),
        lesson.getCreatedAt(),
        lesson.getUpdatedAt());
  }

  public static class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(String message) {
      super(message);
    }
  }

  public static class ConflictException extends RuntimeException {
    public ConflictException(String message) {
      super(message);
    }
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
}
