package com.lms.course.api;

import com.lms.common.security.RBACEnforcer;
import com.lms.course.application.CourseApplicationService;
import com.lms.course.domain.CourseStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/courses")
@RequiredArgsConstructor
@Tag(name = "Admin Course Operations", description = "Moderation and bulk administrative tools for courses")
public class AdminCourseController {

  private final CourseApplicationService courseService;
  private final RBACEnforcer rbacEnforcer;

  @PatchMapping("/{courseId}/status")
  @Operation(summary = "Change course status (Admin moderation: e.g. suspending a course)")
  public CourseDetailResponse updateCourseStatus(
      @PathVariable UUID courseId,
      @RequestParam CourseStatus status) {

    rbacEnforcer.checkRole("ADMIN");

    return courseService.updateCourseStatus(courseId, status);
  }
}
