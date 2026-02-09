package com.lms.enrollment.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

@Component
public class CourseServiceClient {

  private static final Logger log = LoggerFactory.getLogger(CourseServiceClient.class);
  private final RestClient restClient;

  public CourseServiceClient(@Value("${lms.course-service.url}") String courseServiceUrl) {
    this.restClient = RestClient.builder()
        .baseUrl(courseServiceUrl)
        .build();
  }

  @CircuitBreaker(name = "courseService", fallbackMethod = "isCoursePublishedFallback")
  @Retry(name = "courseService")
  public boolean isCoursePublished(UUID courseId) {
    try {
      CourseResponse course = getCourseResponse(courseId);
      return course != null && "PUBLISHED".equalsIgnoreCase(course.status());
    } catch (Exception e) {
      log.error("Error checking course status for: {}", courseId, e);
      throw e; // Rethrow for resilience4j to catch
    }
  }

  @CircuitBreaker(name = "courseService")
  @Retry(name = "courseService")
  public CourseResponse getCourse(UUID courseId) {
    try {
      return getCourseResponse(courseId);
    } catch (Exception e) {
      log.error("Error fetching course details for: {}", courseId, e);
      return new CourseResponse(courseId, "Untitled Course", "UNKNOWN", null);
    }
  }

  private CourseResponse getCourseResponse(UUID courseId) {
    return restClient.get()
        .uri("/api/v1/courses/{courseId}", courseId)
        .header("X-Roles", "ADMIN") // Internal call privilege
        .header("X-User-Id", UUID.randomUUID().toString())
        .retrieve()
        .body(CourseResponse.class);
  }

  public boolean isCoursePublishedFallback(UUID courseId, Throwable t) {
    log.error("Fallback for course status check: {}", courseId, t);
    return false;
  }

  public boolean isUserInstructor(UUID courseId, UUID userId) {
    try {
      return Boolean.TRUE.equals(restClient.get()
          .uri("/api/v1/courses/{courseId}/validate-instructor/{userId}", courseId, userId)
          .retrieve()
          .body(Boolean.class));
    } catch (Exception e) {
      log.error("Error validating instructor for course {}: {}", courseId, e.getMessage());
      return false;
    }
  }

  @CircuitBreaker(name = "courseService", fallbackMethod = "getTotalLessonsFallback")
  @Retry(name = "courseService")
  public int getTotalLessons(UUID courseId) {
    try {
      CourseDetailResponse course = restClient.get()
          .uri("/api/v1/courses/{courseId}", courseId)
          .header("X-Roles", "ADMIN")
          .header("X-User-Id", UUID.randomUUID().toString())
          .retrieve()
          .body(CourseDetailResponse.class);

      if (course == null || course.modules() == null)
        return 0;

      return course.modules().stream()
          .filter(m -> m.lessons() != null)
          .mapToInt(m -> m.lessons().size())
          .sum();
    } catch (Exception e) {
      log.error("Error getting lesson count for course: {}", courseId, e);
      throw e;
    }
  }

  public int getTotalLessonsFallback(UUID courseId, Throwable t) {
    log.error("Fallback for total lessons: {}", courseId, t);
    return 0;
  }

  public record CourseResponse(UUID id, String title, String status, String thumbnailUrl) {
  }

  public record CourseDetailResponse(UUID id, String title, String status, String thumbnailUrl,
      List<ModuleResponse> modules) {
  }

  public record ModuleResponse(UUID id, List<LessonResponse> lessons) {
  }

  public record LessonResponse(UUID id) {
  }
}
