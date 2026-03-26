package com.lms.user.api;

import com.lms.user.application.UserApplicationService;
import com.lms.user.domain.Profile;
import com.lms.user.domain.ProfileRepository;
import com.lms.user.domain.User;
import com.lms.user.domain.UserStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private static final String HEADER_USER_ID = "X-User-Id";
  private static final String HEADER_ROLES = "X-Roles";
  private static final int DEFAULT_PAGE_SIZE = 20;
  private static final int MAX_PAGE_SIZE = 100;

  private final UserApplicationService userService;
  private final ProfileRepository profileRepository;

  public UserController(UserApplicationService userService, ProfileRepository profileRepository) {
    this.userService = userService;
    this.profileRepository = profileRepository;
  }

  @PostMapping
  public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
    User user = userService.createUser(
        request.email(),
        request.password(),
        request.displayName(),
        request.role());
    Set<String> roles = userService.getRoleNamesForUser(user.getId());
    String displayName = profileRepository.findByUserId(user.getId())
        .map(Profile::getDisplayName)
        .orElse(null);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(UserResponseMapper.toResponse(user, displayName, roles));
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> getMe(
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    User user = userService.getById(UUID.fromString(currentUserId));
    return ResponseEntity.ok(buildUserResponse(user));
  }

  @GetMapping("/{userId}")
  public ResponseEntity<UserResponse> getUser(
      @PathVariable UUID userId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    Set<String> roles = parseRoles(currentRolesHeader);
    if (!userId.toString().equals(currentUserId) && !roles.contains("ADMIN")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    User user = userService.getById(userId);
    return ResponseEntity.ok(buildUserResponse(user));
  }

  @PatchMapping("/{userId}")
  public ResponseEntity<UserResponse> updateProfile(
      @PathVariable UUID userId,
      @Valid @RequestBody UpdateProfileRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    Set<String> roles = parseRoles(currentRolesHeader);
    User user = userService.updateProfile(
        userId,
        currentUserId,
        roles,
        request.displayName(),
        request.avatarUrl());
    return ResponseEntity.ok(buildUserResponse(user));
  }

  @PatchMapping("/me")
  public ResponseEntity<UserResponse> updateMe(
      @Valid @RequestBody UpdateProfileRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    UUID userId = UUID.fromString(currentUserId);
    Set<String> roles = parseRoles(currentRolesHeader);
    User user = userService.updateProfile(
        userId,
        currentUserId,
        roles,
        request.displayName(),
        request.avatarUrl());
    return ResponseEntity.ok(buildUserResponse(user));
  }

  @GetMapping
  public ResponseEntity<PageResponse<UserResponse>> listUsers(
      @RequestParam(required = false, defaultValue = "0") int page,
      @RequestParam(required = false) Integer size,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String role,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    Set<String> roles = parseRoles(currentRolesHeader);
    if (!roles.contains("ADMIN")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    int pageSize = size != null ? Math.min(Math.max(1, size), MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;
    Pageable pageable = PageRequest.of(Math.max(0, page), pageSize);
    UserStatus statusFilter = null;
    if (status != null && !status.isBlank()) {
      try {
        statusFilter = UserStatus.valueOf(status.toUpperCase());
      } catch (IllegalArgumentException ignored) {
        // ignore invalid status
      }
    }
    Page<User> users = userService.listUsers(pageable, statusFilter, role);
    Page<UserResponse> content = users.map(u -> buildUserResponse(u));
    return ResponseEntity.ok(new PageResponse<>(
        content.getContent(),
        content.getTotalElements(),
        content.getTotalPages(),
        content.getSize(),
        content.getNumber()));
  }

  @PostMapping("/{userId}/roles")
  public ResponseEntity<Void> assignRole(
      @PathVariable UUID userId,
      @Valid @RequestBody AssignRoleRequest request,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    if (!parseRoles(currentRolesHeader).contains("ADMIN")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    userService.assignRole(userId, request.role());
    return ResponseEntity.noContent().build();
  }

  @org.springframework.web.bind.annotation.DeleteMapping("/{userId}")
  public ResponseEntity<Void> deactivateUser(
      @PathVariable UUID userId,
      @RequestHeader(value = HEADER_USER_ID, required = false) String currentUserId,
      @RequestHeader(value = HEADER_ROLES, required = false) String currentRolesHeader) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    Set<String> roles = parseRoles(currentRolesHeader);
    if (!userId.toString().equals(currentUserId) && !roles.contains("ADMIN")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    userService.deactivateUser(userId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me/export")
  public ResponseEntity<UserDataExport> exportMyData(
      @RequestHeader(value = HEADER_USER_ID) String currentUserId) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    return ResponseEntity.ok(userService.exportUserData(UUID.fromString(currentUserId)));
  }

  @PostMapping("/me/delete-account")
  public ResponseEntity<Void> deleteMyAccount(
      @RequestHeader(value = HEADER_USER_ID) String currentUserId) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    userService.deleteUserAccount(UUID.fromString(currentUserId));
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/push-token")
  public ResponseEntity<Void> updatePushToken(
      @RequestHeader(value = HEADER_USER_ID) String currentUserId,
      @Valid @RequestBody PushTokenRequest request) {
    if (currentUserId == null || currentUserId.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    userService.updatePushToken(UUID.fromString(currentUserId), request.token(), request.platform());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/admin/search")
  public ResponseEntity<java.util.List<UserResponse>> searchUsersByEmail(
      @RequestParam String email,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    if (!roles.contains("ADMIN")) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    java.util.List<UserResponse> responses = userService.searchByEmail(email).stream()
        .map(this::buildUserResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(responses);
  }

  private UserResponse buildUserResponse(User user) {
    String displayName = profileRepository.findByUserId(user.getId())
        .map(Profile::getDisplayName)
        .orElse(null);
    Set<String> roleNames = userService.getRoleNamesForUser(user.getId());
    return UserResponseMapper.toResponse(user, displayName, roleNames);
  }

  private static Set<String> parseRoles(String header) {
    if (header == null || header.isBlank()) {
      return Set.of();
    }
    return java.util.Arrays.stream(header.split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .collect(Collectors.toSet());
  }

  public record PageResponse<T>(java.util.List<T> content, long totalElements, int totalPages, int size, int number) {
  }
}
