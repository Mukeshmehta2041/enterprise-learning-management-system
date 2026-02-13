package com.lms.notification.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
public class EnrollmentServiceClient {

  private final WebClient webClient;

  public EnrollmentServiceClient(WebClient.Builder webClientBuilder,
      @Value("${lms.enrollment.service.url:http://lms-enrollment-service:8080}") String serviceUrl) {
    this.webClient = webClientBuilder.baseUrl(serviceUrl).build();
  }

  public List<UUID> getEnrolledUserIds(UUID courseId) {
    try {
      return webClient.get()
          .uri("/api/v1/enrollments/course/{courseId}?limit=1000", courseId)
          // Using a technical header to bypass security for internal call
          .header("X-Internal-Call", "true")
          .header("X-User-Id", UUID.randomUUID().toString()) // placeholder
          .header("X-Roles", "ADMIN")
          .retrieve()
          .bodyToMono(EnrollmentListResponse.class)
          .map(response -> response.content().stream()
              .map(EnrollmentResponse::userId)
              .collect(Collectors.toList()))
          .block();
    } catch (Exception e) {
      log.error("Error fetching enrollments for course {}: {}", courseId, e.getMessage());
      return Collections.emptyList();
    }
  }

  public record EnrollmentListResponse(List<EnrollmentResponse> content) {
  }

  public record EnrollmentResponse(UUID userId) {
  }
}
