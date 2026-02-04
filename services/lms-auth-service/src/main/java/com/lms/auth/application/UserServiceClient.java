package com.lms.auth.application;

import com.lms.auth.domain.UserCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceClient {

  private static final Logger log = LoggerFactory.getLogger(UserServiceClient.class);
  private final RestClient restClient;

  public UserServiceClient(RestClient restClient) {
    this.restClient = restClient;
  }

  public UserCredentials getUserByEmail(String email) {
    try {
      Map<String, Object> response = restClient.get()
          .uri("/api/v1/internal/users/by-email?email={email}", email)
          .retrieve()
          .onStatus(HttpStatusCode::is4xxClientError, (request, responseEntity) -> {
            log.warn("User not found for email: {}", email);
          })
          .body(new ParameterizedTypeReference<Map<String, Object>>() {
          });

      if (response == null) {
        return null;
      }

      String userIdStr = (String) response.get("userId");
      String emailStr = (String) response.get("email");
      String passwordHashStr = (String) response.get("passwordHash");
      if (userIdStr == null || emailStr == null || passwordHashStr == null || passwordHashStr.isBlank()) {
        log.warn("User Service returned incomplete credentials for email: {}", email);
        return null;
      }

      UserCredentials credentials = new UserCredentials();
      credentials.setUserId(UUID.fromString(userIdStr));
      credentials.setEmail(emailStr);
      credentials.setPasswordHash(passwordHashStr);
      credentials.setStatus((String) response.get("status"));

      @SuppressWarnings("unchecked")
      List<String> rolesList = (List<String>) response.get("roles");
      if (rolesList != null) {
        credentials.setRoles(rolesList.stream().collect(Collectors.toSet()));
      } else {
        credentials.setRoles(Set.of());
      }

      return credentials;
    } catch (Exception e) {
      log.error("Failed to fetch user from User Service for email: {}", email, e);
      return null;
    }
  }
}
