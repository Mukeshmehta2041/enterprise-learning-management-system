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
public class AssignmentServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AssignmentServiceClient.class);
    private final RestClient restClient;

    public AssignmentServiceClient(@Value("${lms.assignment-service.url}") String assignmentServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(assignmentServiceUrl)
                .build();
    }

    @CircuitBreaker(name = "assignmentService")
    @Retry(name = "assignmentService")
    public List<AssignmentSummary> getAssignmentsForCourse(UUID courseId) {
        try {
            return restClient.get()
                    .uri("/api/v1/assignments/course/{courseId}", courseId)
                    .retrieve()
                    .body(new org.springframework.core.ParameterizedTypeReference<List<AssignmentSummary>>() {});
        } catch (Exception e) {
            log.error("Error fetching assignments for course {}: {}", courseId, e.getMessage());
            return List.of();
        }
    }

    public record AssignmentSummary(
            UUID id,
            UUID courseId,
            boolean isMandatory
    ) {}
}
