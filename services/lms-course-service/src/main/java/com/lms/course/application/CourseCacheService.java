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
    return mapToCourseDetailResponse(course);
  }

  @CacheEvict(value = "courses", key = "#courseId")
  public void evictCourse(UUID courseId) {
    // Just evicts
  }

  public CourseDetailResponse mapToCourseDetailResponse(Course course) {
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
        course.getCategory(),
        course.getLevel(),
        course.getPrice(),
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
}
