package com.lms.course.application;

import com.lms.course.api.*;
import com.lms.course.domain.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

  public CourseApplicationService(CourseRepository courseRepository,
      CourseModuleRepository moduleRepository,
      LessonRepository lessonRepository) {
    this.courseRepository = courseRepository;
    this.moduleRepository = moduleRepository;
    this.lessonRepository = lessonRepository;
  }

  @Transactional(readOnly = true)
  public CourseListResponse listCourses(CourseStatus status, Integer limit) {
    int pageSize = limit != null ? Math.min(limit, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
    Pageable pageable = PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

    Page<Course> page;
    if (status != null) {
      page = courseRepository.findByStatus(status, pageable);
    } else {
      page = courseRepository.findAll(pageable);
    }

    List<CourseResponse> items = page.getContent().stream()
        .map(this::mapToCourseResponse)
        .collect(Collectors.toList());

    String nextCursor = page.hasNext() ? String.valueOf(page.getNumber() + 1) : null;

    return new CourseListResponse(items, nextCursor);
  }

  @Transactional(readOnly = true)
  public CourseDetailResponse getCourseById(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    // Authorization: students can only see published; instructors/admin can see
    // their own courses
    if (!canViewCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("No access to this course");
    }

    return mapToCourseDetailResponse(course);
  }

  public CourseDetailResponse createCourse(CreateCourseRequest request, UUID currentUserId, Set<String> roles) {
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

    UUID courseId = UUID.randomUUID();
    CourseStatus status = request.status() != null ? request.status() : CourseStatus.DRAFT;

    Course course = new Course(courseId, request.title(), slug, request.description(), status);

    // Add creator as instructor
    CourseInstructor instructor = new CourseInstructor(course, currentUserId, "INSTRUCTOR");
    course.addInstructor(instructor);

    Course saved = courseRepository.save(course);
    log.info("Course created: {} by user: {}", courseId, currentUserId);

    return mapToCourseDetailResponse(saved);
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
    if (request.status() != null) {
      course.setStatus(request.status());
    }

    Course updated = courseRepository.save(course);
    log.info("Course updated: {} by user: {}", courseId, currentUserId);

    return mapToCourseDetailResponse(updated);
  }

  public void deleteCourse(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canModifyCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("Not authorized to delete this course");
    }

    courseRepository.delete(course);
    log.info("Course deleted: {} by user: {}", courseId, currentUserId);
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

    return mapToModuleResponse(saved);
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

    return mapToModuleResponse(updated);
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

    return mapToLessonResponse(saved);
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

    Lesson updated = lessonRepository.save(lesson);
    log.info("Lesson updated: {}", lessonId);

    return mapToLessonResponse(updated);
  }

  @Transactional(readOnly = true)
  public List<ModuleResponse> getModulesByCourse(UUID courseId, UUID currentUserId, Set<String> roles) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));

    if (!canViewCourse(course, currentUserId, roles)) {
      throw new ForbiddenException("No access to this course");
    }

    return course.getModules().stream()
        .map(this::mapToModuleResponse)
        .collect(Collectors.toList());
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
    List<UUID> instructorIds = course.getInstructors().stream()
        .map(CourseInstructor::getUserId)
        .collect(Collectors.toList());

    return new CourseResponse(
        course.getId(),
        course.getTitle(),
        course.getSlug(),
        course.getDescription(),
        course.getStatus().name(),
        instructorIds,
        course.getCreatedAt(),
        course.getUpdatedAt());
  }

  private CourseDetailResponse mapToCourseDetailResponse(Course course) {
    List<UUID> instructorIds = course.getInstructors().stream()
        .map(CourseInstructor::getUserId)
        .collect(Collectors.toList());

    List<ModuleResponse> modules = course.getModules().stream()
        .map(this::mapToModuleResponse)
        .collect(Collectors.toList());

    return new CourseDetailResponse(
        course.getId(),
        course.getTitle(),
        course.getSlug(),
        course.getDescription(),
        course.getStatus().name(),
        modules,
        instructorIds,
        course.getCreatedAt(),
        course.getUpdatedAt());
  }

  private ModuleResponse mapToModuleResponse(CourseModule module) {
    List<LessonResponse> lessons = module.getLessons().stream()
        .map(this::mapToLessonResponse)
        .collect(Collectors.toList());

    return new ModuleResponse(
        module.getId(),
        module.getTitle(),
        module.getSortOrder(),
        lessons,
        module.getCreatedAt(),
        module.getUpdatedAt());
  }

  private LessonResponse mapToLessonResponse(Lesson lesson) {
    return new LessonResponse(
        lesson.getId(),
        lesson.getTitle(),
        lesson.getType().name(),
        lesson.getDurationMinutes(),
        lesson.getSortOrder(),
        lesson.getCreatedAt(),
        lesson.getUpdatedAt());
  }

  public static class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(String message) {
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

  public static class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
      super(message);
    }
  }
}
