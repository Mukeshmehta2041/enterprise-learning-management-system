package com.lms.content.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

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
}
