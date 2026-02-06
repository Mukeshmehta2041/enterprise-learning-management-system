package com.lms.user.application;

import com.lms.user.domain.*;
import com.lms.user.infrastructure.UserEventPublisher;
import com.lms.user.api.UserDataExport;
import com.lms.common.audit.AuditLogger;
import com.lms.common.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserApplicationService {

  private static final String DEFAULT_ROLE = "STUDENT";

  private final UserRepository userRepository;
  private final ProfileRepository profileRepository;
  private final RoleRepository roleRepository;
  private final UserRoleRepository userRoleRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuditLogger auditLogger;
  private final UserEventPublisher userEventPublisher;

  @Transactional
  public User createUser(String email, String rawPassword, String displayName, String roleName) {
    if (userRepository.existsByEmail(email)) {
      throw new EmailAlreadyExistsException(email);
    }
    String roleToAssign = roleName != null && !roleName.isBlank() ? roleName : DEFAULT_ROLE;
    Role role = roleRepository.findByName(roleToAssign)
        .orElseThrow(() -> new RoleNotFoundException(roleToAssign));

    UUID id = UUID.randomUUID();
    String passwordHash = passwordEncoder.encode(rawPassword);
    User user = new User(id, email, passwordHash, UserStatus.ACTIVE);
    user = userRepository.save(user);

    Profile profile = new Profile(user, displayName, null);
    profileRepository.save(profile);

    userRoleRepository.save(new UserRole(user, role));
    auditLogger.logSuccess("USER_CREATE", "USER", id.toString(), Map.of("email", email, "role", roleToAssign));
    return user;
  }

  @Transactional(readOnly = true)
  public List<User> searchByEmail(String email) {
    return userRepository.findByEmail(email).stream().toList();
  }

  @Transactional
  public User updateStatus(UUID userId, UserStatus status) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));

    UserStatus oldStatus = user.getStatus();
    user.setStatus(status);
    user = userRepository.save(user);

    auditLogger.logSuccess("USER_STATUS_CHANGE", "USER", userId.toString(),
        Map.of("oldStatus", oldStatus, "newStatus", status));

    return user;
  }

  @Transactional(readOnly = true)
  public User getById(UUID userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
  }

  @Transactional(readOnly = true)
  public User getByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new UserNotFoundException(email));
  }

  @Transactional
  public User updateProfile(UUID userId, String currentUserId, Set<String> currentUserRoles,
      String displayName, String avatarUrl) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
    if (currentUserId == null || currentUserRoles == null
        || (!userId.toString().equals(currentUserId) && !currentUserRoles.contains("ADMIN"))) {
      throw new ForbiddenException("Can only update own profile");
    }
    Profile profile = profileRepository.findByUserId(userId)
        .orElseGet(() -> new Profile(user, displayName, avatarUrl));
    if (displayName != null) {
      profile.setDisplayName(displayName);
    }
    if (avatarUrl != null) {
      profile.setAvatarUrl(avatarUrl);
    }
    profileRepository.save(profile);
    auditLogger.logSuccess("USER_UPDATE_PROFILE", "USER", userId.toString());
    return user;
  }

  @Transactional(readOnly = true)
  public Page<User> listUsers(Pageable pageable, UserStatus statusFilter, String roleFilter) {
    boolean hasRole = roleFilter != null && !roleFilter.isBlank();
    if (statusFilter != null && hasRole) {
      return userRepository.findAllByStatusAndRoleName(statusFilter, roleFilter, pageable);
    }
    if (statusFilter != null) {
      return userRepository.findAllByStatus(statusFilter, pageable);
    }
    if (hasRole) {
      return userRepository.findAllByRoleName(roleFilter, pageable);
    }
    return userRepository.findAll(pageable);
  }

  @Transactional
  public User deactivateUser(UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
    user.setStatus(UserStatus.DEACTIVATED);
    User saved = userRepository.save(user);
    auditLogger.logSuccess("USER_DEACTIVATE", "USER", userId.toString());
    return saved;
  }

  @Transactional
  public void assignRole(UUID userId, String roleName) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
    Role role = roleRepository.findByName(roleName)
        .orElseThrow(() -> new RoleNotFoundException(roleName));
    UserRoleId id = new UserRoleId(userId, role.getId());
    if (userRoleRepository.existsById(id)) {
      return;
    }
    userRoleRepository.save(new UserRole(user, role));
    auditLogger.logSuccess("USER_ASSIGN_ROLE", "USER", userId.toString(), Map.of("role", roleName));
  }

  @Transactional(readOnly = true)
  public Set<String> getRoleNamesForUser(UUID userId) {
    return userRoleRepository.findAllByUserId(userId).stream()
        .map(ur -> ur.getRole().getName())
        .collect(Collectors.toSet());
  }

  @Transactional
  public void deleteUserAccount(UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));

    // Hard delete or Anonymize? GDPR "Right to Erasure" often requires removal
    // We'll perform a hard delete of user-identifiable data in this service
    profileRepository.deleteByUserId(userId);
    userRoleRepository.deleteAllByUserId(userId);
    userRepository.delete(user);

    auditLogger.logSuccess("USER_ACCOUNT_DELETE", "USER", userId.toString(), Map.of("email", user.getEmail()));

    // Notify other services to cleanup (Enrollments, Assignments, etc.)
    userEventPublisher.publishUserDeleted(userId);
  }

  @Transactional(readOnly = true)
  public UserDataExport exportUserData(UUID userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));
    Profile profile = profileRepository.findByUserId(userId).orElse(null);
    Set<String> roles = getRoleNamesForUser(userId);

    return new UserDataExport(
        user.getId(),
        user.getEmail(),
        profile != null ? profile.getDisplayName() : null,
        profile != null ? profile.getAvatarUrl() : null,
        roles,
        user.getStatus().name());
  }
}
