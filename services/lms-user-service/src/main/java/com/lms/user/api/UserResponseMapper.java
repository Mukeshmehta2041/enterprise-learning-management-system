package com.lms.user.api;

import com.lms.user.domain.Profile;
import com.lms.user.domain.User;

import java.util.Set;

public final class UserResponseMapper {

    private UserResponseMapper() {
    }

    public static UserResponse toResponse(User user, String displayName, Set<String> roles) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                displayName,
                roles,
                user.getStatus().name(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public static UserResponse toResponse(User user, Profile profile, Set<String> roles) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                profile != null ? profile.getDisplayName() : null,
                roles,
                user.getStatus().name(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
