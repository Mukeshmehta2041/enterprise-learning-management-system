package com.lms.auth.api;

import java.util.Set;

public record IntrospectResponse(
    boolean active,
    String sub,
    Set<String> roles,
    long exp,
    long iat,
    String email) {
}
