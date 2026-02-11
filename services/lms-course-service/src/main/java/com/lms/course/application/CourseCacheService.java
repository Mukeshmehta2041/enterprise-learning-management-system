package com.lms.course.application;

import com.lms.course.api.CourseDetailResponse;
import com.lms.course.domain.Course;
import com.lms.course.domain.CourseInstructor;
import com.lms.course.domain.CourseModule;
import com.lms.course.api.ModuleResponse;
import com.lms.course.api.LessonResponse;
import com.lms.course.domain.Lesson;
import com.lms.course.domain.CourseRepository;
import com.lms.course.application.CourseApplicationService.CourseNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseCacheService {

  private final CourseRepository courseRepository;

  @Cacheable(value = "courses", key = "#courseId")
  @Transactional(readOnly = true)
  public CourseDetailResponse getCourseDetail(UUID courseId) {
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new CourseNotFoundException("Course not found: " + courseId));
    return mapToCourseDetailResponse(course, false);
  }

  @CacheEvict(value = "courses", key = "#courseId")
  public void evictCourse(UUID courseId) {
    // Just evicts
  }

  public CourseDetailResponse mapToCourseDetailResponse(Course course, boolean hasAccess) {
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
        course.getStatus() != null ? course.getStatus().name() : "DRAFT",
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
        lesson.getStatus(),
        lesson.getCreatedAt(),
        lesson.getUpdatedAt());
  }
}
