package com.lms.course.api;

import com.lms.course.application.CourseApplicationService;
import com.lms.course.domain.CourseStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/courses")
@Tag(name = "Courses", description = "Course management endpoints")
public class CourseController {

  private static final Logger log = LoggerFactory.getLogger(CourseController.class);
  private static final String HEADER_USER_ID = "X-User-Id";
  private static final String HEADER_ROLES = "X-Roles";

  private final CourseApplicationService courseService;

  public CourseController(CourseApplicationService courseService) {
    this.courseService = courseService;
  }

  @GetMapping
  @Operation(summary = "List courses", description = "Retrieves a paginated list of courses")
  public ResponseEntity<CourseListResponse> listCourses(
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer limit) {

    CourseStatus courseStatus = null;
    if (status != null && !status.isBlank()) {
      try {
        courseStatus = CourseStatus.valueOf(status.toUpperCase());
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
      }
    }

    CourseListResponse response = courseService.listCourses(courseStatus, cursor, limit);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{courseId}")
  public ResponseEntity<CourseDetailResponse> getCourse(
      @PathVariable UUID courseId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    CourseDetailResponse response = courseService.getCourseById(courseId, userId, roles);
    return ResponseEntity.ok(response);
  }

  @PostMapping
  public ResponseEntity<CourseDetailResponse> createCourse(
      @Valid @RequestBody CreateCourseRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    CourseDetailResponse response = courseService.createCourse(request, userId, roles);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping("/{courseId}")
  public ResponseEntity<CourseDetailResponse> updateCourse(
      @PathVariable UUID courseId,
      @Valid @RequestBody UpdateCourseRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    CourseDetailResponse response = courseService.updateCourse(courseId, request, userId, roles);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{courseId}")
  public ResponseEntity<Void> deleteCourse(
      @PathVariable UUID courseId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    courseService.deleteCourse(courseId, userId, roles);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{courseId}/modules")
  public ResponseEntity<List<ModuleResponse>> getModules(
      @PathVariable UUID courseId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    List<ModuleResponse> modules = courseService.getModulesByCourse(courseId, userId, roles);
    return ResponseEntity.ok(modules);
  }

  @PostMapping("/{courseId}/modules")
  public ResponseEntity<ModuleResponse> createModule(
      @PathVariable UUID courseId,
      @Valid @RequestBody CreateModuleRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    ModuleResponse response = courseService.createModule(courseId, request, userId, roles);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping("/{courseId}/modules/{moduleId}")
  public ResponseEntity<ModuleResponse> updateModule(
      @PathVariable UUID courseId,
      @PathVariable UUID moduleId,
      @Valid @RequestBody UpdateModuleRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    ModuleResponse response = courseService.updateModule(courseId, moduleId, request, userId, roles);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{courseId}/modules/{moduleId}/lessons")
  public ResponseEntity<LessonResponse> createLesson(
      @PathVariable UUID courseId,
      @PathVariable UUID moduleId,
      @Valid @RequestBody CreateLessonRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    LessonResponse response = courseService.createLesson(courseId, moduleId, request, userId, roles);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping("/{courseId}/modules/{moduleId}/lessons/{lessonId}")
  public ResponseEntity<LessonResponse> updateLesson(
      @PathVariable UUID courseId,
      @PathVariable UUID moduleId,
      @PathVariable UUID lessonId,
      @Valid @RequestBody UpdateLessonRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    LessonResponse response = courseService.updateLesson(courseId, moduleId, lessonId, request, userId, roles);
    return ResponseEntity.ok(response);
  }

  private Set<String> parseRoles(String rolesHeader) {
    if (rolesHeader == null || rolesHeader.isBlank()) {
      return Set.of();
    }
    return Stream.of(rolesHeader.split(","))
        .map(String::trim)
        .map(String::toUpperCase)
        .collect(Collectors.toSet());
  }
}
