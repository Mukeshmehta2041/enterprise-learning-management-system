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
      CourseResponse course = restClient.get()
          .uri("/api/v1/courses/{courseId}", courseId)
          .header("X-Roles", "ADMIN") // Internal call privilege
          .header("X-User-Id", UUID.randomUUID().toString())
          .retrieve()
          .body(CourseResponse.class);

      return course != null && "PUBLISHED".equalsIgnoreCase(course.status());
    } catch (Exception e) {
      log.error("Error checking course status for: {}", courseId, e);
      throw e; // Rethrow for resilience4j to catch
    }
  }

  public boolean isCoursePublishedFallback(UUID courseId, Throwable t) {
    log.error("Fallback for course status check: {}", courseId, t);
    return false;
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

  public record CourseResponse(UUID id, String status) {
  }

  public record CourseDetailResponse(UUID id, List<ModuleResponse> modules) {
  }

  public record ModuleResponse(UUID id, List<LessonResponse> lessons) {
  }

  public record LessonResponse(UUID id) {
  }
}
