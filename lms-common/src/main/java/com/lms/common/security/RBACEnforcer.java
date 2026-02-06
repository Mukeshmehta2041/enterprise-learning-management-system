package com.lms.common.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Slf4j
public class RBACEnforcer {

  public void checkResourceOwnership(String resourceOwnerId) {
    UserContext userContext = UserContextHolder.getContext();
    if (userContext == null) {
      throw new AccessDeniedException("No user context found");
    }
    if (userContext.isAdmin()) {
      return; // Admins can access everything
    }

    if (!resourceOwnerId.equals(userContext.getUserId())) {
      throw new AccessDeniedException("You do not have permission to access this resource");
    }
  }

  public void checkResourceInstructor(String courseInstructorId) {
    UserContext userContext = UserContextHolder.getContext();
    if (userContext == null) {
      throw new AccessDeniedException("No user context found");
    }
    if (userContext.isAdmin()) {
      return; // Admins can access everything
    }

    if (!userContext.isInstructor() || !courseInstructorId.equals(userContext.getUserId())) {
      throw new AccessDeniedException("Only the course instructor can access this resource");
    }
  }

  public void checkRole(String... allowedRoles) {
    UserContext userContext = UserContextHolder.getContext();
    if (userContext == null) {
      throw new AccessDeniedException("No user context found");
    }
    if (!userContext.hasAnyRole(allowedRoles)) {
      throw new AccessDeniedException("Your role does not have permission to access this resource");
    }
  }

  public static class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
      super(message);
    }
  }
}
