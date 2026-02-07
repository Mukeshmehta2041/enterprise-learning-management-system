package com.lms.auth.api;

import com.lms.auth.BaseIntegrationTest;
import com.lms.auth.application.UserServiceClient;
import com.lms.auth.domain.UserCredentials;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class AuthControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @MockitoBean
  private UserServiceClient userServiceClient;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Test
  void shouldLoginSuccessfully() {
    String email = "test@example.com";
    String password = "password123";
    UUID userId = UUID.randomUUID();

    UserCredentials credentials = new UserCredentials();
    credentials.setUserId(userId);
    credentials.setEmail(email);
    credentials.setPasswordHash(passwordEncoder.encode(password));
    credentials.setStatus("ACTIVE");
    credentials.setRoles(Set.of("STUDENT"));

    when(userServiceClient.getUserByEmail(email)).thenReturn(credentials);

    LoginRequest loginRequest = new LoginRequest(email, password);
    ResponseEntity<TokenResponse> response = restTemplate.postForEntity("/api/v1/auth/login", loginRequest,
        TokenResponse.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().accessToken()).isNotBlank();
    assertThat(response.getBody().refreshToken()).isNotBlank();
  }

  @Test
  void shouldLogoutSuccessfully() {
    String email = "test@example.com";
    String password = "password123";
    UUID userId = UUID.randomUUID();

    UserCredentials credentials = new UserCredentials();
    credentials.setUserId(userId);
    credentials.setEmail(email);
    credentials.setPasswordHash(passwordEncoder.encode(password));
    credentials.setStatus("ACTIVE");
    credentials.setRoles(Set.of("STUDENT"));

    when(userServiceClient.getUserByEmail(email)).thenReturn(credentials);

    // Login first
    LoginRequest loginRequest = new LoginRequest(email, password);
    ResponseEntity<TokenResponse> loginResponse = restTemplate.postForEntity("/api/v1/auth/login", loginRequest,
        TokenResponse.class);
    String accessToken = loginResponse.getBody().accessToken();
    String refreshToken = loginResponse.getBody().refreshToken();

    // Logout
    LogoutRequest logoutRequest = new LogoutRequest(refreshToken);
    restTemplate.getRestTemplate().setInterceptors(java.util.List.of((request, body, execution) -> {
      request.getHeaders().add("Authorization", "Bearer " + accessToken);
      return execution.execute(request, body);
    }));

    ResponseEntity<Void> logoutResponse = restTemplate.postForEntity("/api/v1/auth/logout", logoutRequest, Void.class);

    assertThat(logoutResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
  }
}
