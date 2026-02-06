package com.lms.course.api;

import com.lms.course.BaseIntegrationTest;
import com.lms.course.domain.CourseStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class CourseControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @Test
  void shouldCreateCourse() {
    String instructorId = UUID.randomUUID().toString();
    CreateCourseRequest request = new CreateCourseRequest(
        "Test Course",
        "test-course",
        "Description",
        CourseStatus.DRAFT);

    restTemplate.getRestTemplate().setInterceptors(java.util.List.of((httpRequest, body, execution) -> {
      httpRequest.getHeaders().add("X-User-Id", instructorId);
      httpRequest.getHeaders().add("X-Roles", "INSTRUCTOR");
      return execution.execute(httpRequest, body);
    }));

    ResponseEntity<CourseDetailResponse> response = restTemplate.postForEntity("/api/v1/courses", request,
        CourseDetailResponse.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().title()).isEqualTo("Test Course");
  }

  @Test
  void shouldListCourses() {
    ResponseEntity<CourseListResponse> response = restTemplate.getForEntity("/api/v1/courses",
        CourseListResponse.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
  }
}
