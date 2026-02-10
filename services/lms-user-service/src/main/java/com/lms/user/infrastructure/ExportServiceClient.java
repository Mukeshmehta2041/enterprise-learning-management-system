package com.lms.user.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class ExportServiceClient {

  private final RestClient enrollmentClient;
  private final RestClient assignmentClient;

  public ExportServiceClient(
      @Value("${enrollment-service.url:http://lms-enrollment-service:8084}") String enrollmentUrl,
      @Value("${assignment-service.url:http://lms-assignment-service:8083}") String assignmentUrl) {
    this.enrollmentClient = RestClient.builder().baseUrl(enrollmentUrl).build();
    this.assignmentClient = RestClient.builder().baseUrl(assignmentUrl).build();
  }

  public List<Map<String, Object>> getEnrollments(UUID userId) {
    try {
      return enrollmentClient.get()
          .uri("/api/v1/internal/enrollments/export?userId={userId}", userId)
          .retrieve()
          .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {
          });
    } catch (Exception e) {
      log.error("Failed to fetch enrollments for user: {}", userId, e);
      return Collections.emptyList();
    }
  }

  public List<Map<String, Object>> getSubmissions(UUID userId) {
    try {
      return assignmentClient.get()
          .uri("/api/v1/internal/assignments/export?userId={userId}", userId)
          .retrieve()
          .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {
          });
    } catch (Exception e) {
      log.error("Failed to fetch submissions for user: {}", userId, e);
      return Collections.emptyList();
    }
  }
}
