package com.lms.user.api;

import com.lms.user.BaseIntegrationTest;
import com.lms.user.domain.User;
import com.lms.user.domain.UserRole;
import com.lms.user.application.UserApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

public class UserControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @Autowired
  private UserApplicationService userApplicationService;

  @Test
  void shouldCreateUser() {
    CreateUserRequest request = new CreateUserRequest(
        "test@example.com",
        "password123",
        "Test User",
        "STUDENT");

    ResponseEntity<UserResponse> response = restTemplate.postForEntity("/api/v1/users", request, UserResponse.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().email()).isEqualTo("test@example.com");
    assertThat(response.getBody().displayName()).isEqualTo("Test User");
    assertThat(response.getBody().roles()).contains("STUDENT");
  }

  @Test
  void shouldGetUserById() {
    User user = userApplicationService.createUser("gettest@example.com", "password", "Get User", "STUDENT");

    ResponseEntity<UserResponse> response = restTemplate
        .withBasicAuth("user", "password") // Not using real auth yet, just checking headers
        .getForEntity("/api/v1/users/" + user.getId(), UserResponse.class);

    // UserController expects headers from gateway
    restTemplate.getRestTemplate().setInterceptors(java.util.List.of((request, body, execution) -> {
      request.getHeaders().add("X-User-Id", user.getId().toString());
      request.getHeaders().add("X-Roles", "STUDENT");
      return execution.execute(request, body);
    }));

    response = restTemplate.getForEntity("/api/v1/users/" + user.getId(), UserResponse.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody().email()).isEqualTo("gettest@example.com");
  }
}
