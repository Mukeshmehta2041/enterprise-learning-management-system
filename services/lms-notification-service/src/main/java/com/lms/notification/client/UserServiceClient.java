package com.lms.notification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-service")
public interface UserServiceClient {
  @GetMapping("/api/v1/internal/users/{userId}/push-token")
  PushTokenResponse getPushToken(@PathVariable("userId") UUID userId);

  record PushTokenResponse(String token, String platform) {
  }
}
