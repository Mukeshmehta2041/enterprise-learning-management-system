package com.lms.user.api;

import com.lms.user.application.UserApplicationService;
import com.lms.user.domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/internal/users")
public class InternalUserController {

  private final UserApplicationService userService;

  public InternalUserController(UserApplicationService userService) {
    this.userService = userService;
  }

  @GetMapping("/by-email")
  public ResponseEntity<Map<String, Object>> getUserByEmail(@RequestParam String email) {
    User user = userService.getByEmail(email);
    Set<String> roles = userService.getRoleNamesForUser(user.getId());

    Map<String, Object> response = Map.of(
        "userId", user.getId().toString(),
        "email", user.getEmail(),
        "passwordHash", user.getPasswordHash(),
        "status", user.getStatus().name(),
        "roles", roles);

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{userId}/push-token")
  public ResponseEntity<Map<String, String>> getPushToken(
      @org.springframework.web.bind.annotation.PathVariable java.util.UUID userId) {
    var user = userService.getById(userId);
    var profile = userService.getProfile(userId);
    if (profile.getPushToken() == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(Map.of(
        "token", profile.getPushToken(),
        "platform", profile.getPushPlatform() != null ? profile.getPushPlatform() : "unknown"));
  }
}
