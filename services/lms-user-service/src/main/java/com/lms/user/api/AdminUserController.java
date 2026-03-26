package com.lms.user.api;

import com.lms.common.security.RBACEnforcer;
import com.lms.user.application.UserApplicationService;
import com.lms.user.domain.User;
import com.lms.user.domain.UserStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Operations", description = "Privileged user management endpoints")
public class AdminUserController {

  private final UserApplicationService userService;
  private final RBACEnforcer rbacEnforcer;

  @GetMapping("/search")
  @Operation(summary = "Search users by email (Admin only)")
  public List<UserResponse> searchUsers(
      @RequestParam String email) {

    rbacEnforcer.checkRole("ADMIN");

    return userService.searchByEmail(email).stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  @PatchMapping("/{userId}/status")
  @Operation(summary = "Change user status (Admin only - for suspension/reactivation)")
  public UserResponse updateUserStatus(
      @PathVariable UUID userId,
      @RequestParam UserStatus status) {

    rbacEnforcer.checkRole("ADMIN");

    User user = userService.updateStatus(userId, status);
    return mapToResponse(user);
  }

  private UserResponse mapToResponse(User user) {
    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getDisplayName(),
        user.getRoles().stream().map(ur -> ur.getRole().getName()).collect(Collectors.toSet()),
        user.getStatus().name(),
        user.getCreatedAt(),
        user.getUpdatedAt());
  }
}
