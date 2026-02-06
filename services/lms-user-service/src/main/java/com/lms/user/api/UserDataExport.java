package com.lms.user.api;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public record UserDataExport(
    UUID userId,
    String email,
    String displayName,
    String avatarUrl,
    Set<String> roles,
    String status) {
}
