package com.lms.enrollment.api;

import com.lms.enrollment.BaseIntegrationTest;
import com.lms.enrollment.client.CourseServiceClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class EnrollmentControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @MockBean
  private CourseServiceClient courseServiceClient;

  @Test
  void shouldEnrollInCourse() {
    UUID userId = UUID.randomUUID();
    UUID courseId = UUID.randomUUID();
    EnrollRequest request = new EnrollRequest(courseId);

    when(courseServiceClient.isCoursePublished(any(UUID.class))).thenReturn(true);

    restTemplate.getRestTemplate().setInterceptors(java.util.List.of((httpRequest, body, execution) -> {
      httpRequest.getHeaders().add("X-User-Id", userId.toString());
      httpRequest.getHeaders().add("X-Roles", "STUDENT");
      return execution.execute(httpRequest, body);
    }));

    ResponseEntity<EnrollmentResponse> response = restTemplate.postForEntity("/api/v1/enrollments", request,
        EnrollmentResponse.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().courseId()).isEqualTo(courseId);
  }
}
