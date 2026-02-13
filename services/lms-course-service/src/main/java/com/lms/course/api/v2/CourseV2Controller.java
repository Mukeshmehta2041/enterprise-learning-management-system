package com.lms.course.api.v2;

import com.lms.course.application.CourseApplicationService;
import com.lms.course.api.CourseListResponse;
import com.lms.course.api.CourseResponse;
import com.lms.course.domain.CourseStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v2/courses")
@Tag(name = "Courses V2", description = "Course management endpoints (V2)")
public class CourseV2Controller {

  private final CourseApplicationService courseService;

  public CourseV2Controller(CourseApplicationService courseService) {
    this.courseService = courseService;
  }

  @GetMapping
  @Operation(summary = "List courses V2", description = "Retrieves a paginated list of courses with consistent metadata and extra fields")
  public ResponseEntity<CourseListResponseV2> listCourses(
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
      @RequestParam(required = false, defaultValue = "1") Integer page,
      @RequestHeader(value = "X-User-Id", required = false) String currentUserId,
      @RequestHeader(value = "X-Roles", required = false) String currentRolesHeader) {

    UUID userId = currentUserId != null && !currentUserId.isBlank() ? UUID.fromString(currentUserId) : null;
    Set<String> roles = parseRoles(currentRolesHeader);

    CourseStatus courseStatus = null;
    if (status != null && !status.isBlank()) {
      try {
        courseStatus = CourseStatus.valueOf(status.toUpperCase());
      } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
      }
    }

    CourseListResponse v1Response = courseService.listCourses(
        courseStatus,
        category,
        level,
        search,
        isFeatured,
        isTrending,
        tags,
        sort,
        order,
        cursor,
        limit,
        page,
        userId,
        roles);

    return ResponseEntity.ok(convertToV2(v1Response));
  }

  private CourseListResponseV2 convertToV2(CourseListResponse v1) {
    List<CourseResponseV2> data = v1.content().stream()
        .map(this::mapToV2)
        .collect(Collectors.toList());

    PaginationMetadata metadata = new PaginationMetadata(
        v1.totalElements(),
        v1.number(),
        v1.size(),
        v1.totalPages(),
        v1.nextCursor());

    return new CourseListResponseV2(data, metadata);
  }

  private CourseResponseV2 mapToV2(CourseResponse v1) {
    return new CourseResponseV2(
        v1.id(),
        v1.title(),
        v1.slug(),
        v1.description(),
        v1.category(),
        v1.level(),
        v1.price(),
        v1.status(),
        v1.instructorIds(),
        4.8, // Example of enhanced field in V2
        1240, // Example of enhanced field in V2
        v1.createdAt(),
        v1.updatedAt());
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
