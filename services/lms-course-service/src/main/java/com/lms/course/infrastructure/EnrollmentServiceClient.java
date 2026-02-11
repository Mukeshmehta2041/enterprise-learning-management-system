package com.lms.course.infrastructure;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Component
public class EnrollmentServiceClient {

  private static final Logger log = LoggerFactory.getLogger(EnrollmentServiceClient.class);
  private final RestClient restClient;

  public EnrollmentServiceClient(@Value("${lms.enrollment-service.url}") String enrollmentServiceUrl) {
    this.restClient = RestClient.builder()
        .baseUrl(enrollmentServiceUrl)
        .build();
  }

  public boolean isUserEnrolled(UUID userId, UUID courseId) {
    try {
      return Boolean.TRUE.equals(restClient.get()
          .uri(uriBuilder -> uriBuilder
              .path("/api/v1/enrollments/validate")
              .queryParam("userId", userId)
              .queryParam("courseId", courseId)
              .build())
          .retrieve()
          .body(Boolean.class));
    } catch (Exception e) {
      log.error("Error validating enrollment for course {} and user {}: {}", courseId, userId, e.getMessage());
      return false;
    }
  }
}
