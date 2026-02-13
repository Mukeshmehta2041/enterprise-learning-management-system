package com.lms.course.api;

import com.lms.course.application.CourseApplicationService;
import com.lms.course.domain.CourseStatus;
import com.lms.common.api.SparseFieldFilter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
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
  public ResponseEntity<?> listCourses(
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String level,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) Boolean isFeatured,
      @RequestParam(required = false) Boolean isTrending,
      @RequestParam(required = false) List<String> tags,
      @RequestParam(required = false) String sort,
      @RequestParam(required = false, defaultValue = "desc") String order,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer size,
      @RequestParam(required = false, defaultValue = "1") Integer page,
      @RequestParam(required = false) String fields,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    UUID userId = currentUserId != null ? !currentUserId.isBlank() ? UUID.fromString(currentUserId) : null : null;
    Set<String> roles = parseRoles(currentRolesHeader);

    CourseStatus courseStatus = null;
    if (status != null && !status.isBlank()) {
      try {
        courseStatus = CourseStatus.valueOf(status.toUpperCase());
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
      }
    }

    Integer effectiveLimit = limit != null ? limit : size;
    CourseListResponse response = courseService.listCourses(
        courseStatus, category, level, search, isFeatured, isTrending, tags,
        sort, order, cursor, effectiveLimit, page, userId, roles);

    MappingJacksonValue filteredResponse = SparseFieldFilter.filter(response, fields);

    CacheControl cacheControl = (userId == null)
        ? CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic()
        : CacheControl.noCache().mustRevalidate();

    return ResponseEntity.ok()
        .cacheControl(cacheControl)
        .header("Deprecation", "true")
        .header("Sunset", "2025-12-31")
        .header("Link", "</api/v2/courses>; rel=\"successor-version\"")
        .body(filteredResponse);
  }

  @GetMapping("/me")
  @Operation(summary = "List my courses", description = "Retrieves courses where the user is an instructor")
  public ResponseEntity<CourseListResponse> listMyCourses(
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer size,
      @RequestParam(required = false, defaultValue = "1") Integer page,
      @RequestHeader(value = HEADER_USER_ID) String currentUserId) {

    UUID userId = UUID.fromString(currentUserId);
    Integer effectiveLimit = limit != null ? limit : size;
    CourseListResponse response = courseService.listMyCourses(cursor, effectiveLimit, page, userId);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{courseId}/duplicate")
  public ResponseEntity<CourseResponse> duplicateCourse(
      @PathVariable UUID courseId,
      @RequestHeader(HEADER_USER_ID) String currentUserId,
      @RequestHeader(HEADER_ROLES) String currentRolesHeader) {
    UUID userId = UUID.fromString(currentUserId);
    Set<String> roles = parseRoles(currentRolesHeader);
    return ResponseEntity.ok(courseService.duplicateCourse(courseId, userId, roles));
  }

  @GetMapping("/{courseId}/validate-instructor/{userId}")
  public ResponseEntity<Boolean> validateInstructor(
      @PathVariable UUID courseId,
      @PathVariable UUID userId) {
    boolean isInstructor = courseService.isUserInstructor(courseId, userId);
    return ResponseEntity.ok(isInstructor);
  }

  @GetMapping("/{courseId}/lessons/{lessonId}/validate-preview")
  public ResponseEntity<Boolean> validatePreview(
      @PathVariable UUID courseId,
      @PathVariable UUID lessonId) {
    boolean isPreview = courseService.isLessonPreview(courseId, lessonId);
    return ResponseEntity.ok(isPreview);
  }

  @GetMapping("/{courseId}/is-free")
  public ResponseEntity<Boolean> isFree(@PathVariable UUID courseId) {
    boolean isFree = courseService.isFree(courseId);
    return ResponseEntity.ok(isFree);
  }

  @GetMapping("/{courseId}/is-published")
  public ResponseEntity<Boolean> isPublished(@PathVariable UUID courseId) {
    boolean isPublished = courseService.getCourseStatus(courseId) == CourseStatus.PUBLISHED;
    return ResponseEntity.ok(isPublished);
  }

  @GetMapping("/{courseId}")
  public ResponseEntity<CourseDetailResponse> getCourse(
      @PathVariable UUID courseId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader,
      WebRequest webRequest) {

    UUID userId = (currentUserId != null && !currentUserId.isBlank()) ? UUID.fromString(currentUserId) : null;
    Set<String> roles = parseRoles(currentRolesHeader);

    // Day 17: Conditional GET optimization
    Instant lastUpdate = courseService.getUpdatedAt(courseId);
    if (lastUpdate != null) {
      String etag = String.format("\"%s-%d\"", courseId, lastUpdate.toEpochMilli());
      if (webRequest.checkNotModified(etag)) {
        return null;
      }
    }

    CourseDetailResponse response = courseService.getCourseById(courseId, userId, roles);

    CacheControl cacheControl = CacheControl.maxAge(Duration.ofMinutes(1)).cachePublic();
    String etag = String.format("\"%s-%d\"", courseId, response.updatedAt().toEpochMilli());

    return ResponseEntity.ok()
        .cacheControl(cacheControl)
        .eTag(etag)
        .header("Deprecation", "true")
        .header("Sunset", "2025-12-31")
        .body(response);
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

  @PostMapping("/{courseId}/publish")
  public ResponseEntity<CourseDetailResponse> publishCourse(
      @PathVariable UUID courseId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    CourseDetailResponse response = courseService.publishCourse(courseId, userId, roles);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/{courseId}/draft")
  public ResponseEntity<CourseDetailResponse> saveDraft(
      @PathVariable UUID courseId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    CourseDetailResponse response = courseService.saveAsDraft(courseId, userId, roles);
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

  @DeleteMapping("/{courseId}/modules/{moduleId}")
  @Operation(summary = "Delete a module", description = "Deletes a module from a course")
  public ResponseEntity<Void> deleteModule(
      @PathVariable UUID courseId,
      @PathVariable UUID moduleId,
      @RequestHeader(value = HEADER_USER_ID) String currentUserId,
      @RequestHeader(value = HEADER_ROLES) String currentRolesHeader) {

    UUID userId = UUID.fromString(currentUserId);
    Set<String> roles = parseRoles(currentRolesHeader);

    courseService.deleteModule(courseId, moduleId, userId, roles);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{courseId}/modules/reorder")
  @Operation(summary = "Reorder modules", description = "Updates the sort order of multiple modules in a course")
  public ResponseEntity<Void> reorderModules(
      @PathVariable UUID courseId,
      @Valid @RequestBody BulkReorderRequest request,
      @RequestHeader(value = HEADER_USER_ID) String currentUserId,
      @RequestHeader(value = HEADER_ROLES) String currentRolesHeader) {

    UUID userId = UUID.fromString(currentUserId);
    Set<String> roles = parseRoles(currentRolesHeader);

    courseService.reorderModules(courseId, request, userId, roles);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{courseId}/curriculum/sync")
  @Operation(summary = "Sync curriculum", description = "Saves the entire course modules and lessons structure in one request")
  public ResponseEntity<List<ModuleResponse>> syncCurriculum(
      @PathVariable UUID courseId,
      @Valid @RequestBody SyncCurriculumRequest request,
      @RequestHeader(value = HEADER_USER_ID) String currentUserId,
      @RequestHeader(value = HEADER_ROLES) String currentRolesHeader) {

    UUID userId = UUID.fromString(currentUserId);
    Set<String> roles = parseRoles(currentRolesHeader);

    List<ModuleResponse> modules = courseService.syncCurriculum(courseId, request, userId, roles);
    return ResponseEntity.ok(modules);
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

  @PostMapping("/{courseId}/modules/{moduleId}/lessons/reorder")
  public ResponseEntity<Void> reorderLessons(
      @PathVariable UUID courseId,
      @PathVariable UUID moduleId,
      @Valid @RequestBody BulkReorderRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    courseService.reorderLessons(courseId, moduleId, request, userId, roles);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{courseId}/modules/{moduleId}/lessons/{lessonId}")
  public ResponseEntity<Void> deleteLesson(
      @PathVariable UUID courseId,
      @PathVariable UUID moduleId,
      @PathVariable UUID lessonId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {

    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Set<String> roles = parseRoles(currentRolesHeader);
    UUID userId = UUID.fromString(currentUserId);

    courseService.deleteLesson(courseId, moduleId, lessonId, userId, roles);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/admin/bulk-status")
  @Operation(summary = "Bulk update course status", description = "Admin only. Update status of multiple courses.")
  public ResponseEntity<Void> bulkUpdateStatus(
      @RequestBody BulkStatusUpdateRequest request,
      @RequestHeader(value = HEADER_USER_ID) String currentUserId,
      @RequestHeader(value = HEADER_ROLES) String currentRolesHeader) {
    Set<String> roles = parseRoles(currentRolesHeader);
    if (!roles.contains("ADMIN")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    courseService.bulkUpdateStatus(request.courseIds(), request.status(), UUID.fromString(currentUserId));
    return ResponseEntity.ok().build();
  }

  public record BulkStatusUpdateRequest(List<UUID> courseIds, CourseStatus status) {
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
