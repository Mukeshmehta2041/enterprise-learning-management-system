package com.lms.user.api;

import com.lms.user.domain.Profile;
import com.lms.user.domain.User;

import java.util.Set;

public final class UserResponseMapper {

  private UserResponseMapper() {
  }

  public static UserResponse toResponse(User user, String displayName, Set<String> roles) {
    String finalDisplayName = (displayName != null && !displayName.isBlank())
        ? displayName
        : user.getEmail().split("@")[0];

    return new UserResponse(
        user.getId(),
        user.getEmail(),
        finalDisplayName,
        roles,
        user.getStatus().name(),
        user.getCreatedAt(),
        user.getUpdatedAt());
  }

  public static UserResponse toResponse(User user, Profile profile, Set<String> roles) {
    String displayName = (profile != null && profile.getDisplayName() != null && !profile.getDisplayName().isBlank())
        ? profile.getDisplayName()
        : user.getEmail().split("@")[0];

    return new UserResponse(
        user.getId(),
        user.getEmail(),
        displayName,
        roles,
        user.getStatus().name(),
        user.getCreatedAt(),
        user.getUpdatedAt());
  }
}
