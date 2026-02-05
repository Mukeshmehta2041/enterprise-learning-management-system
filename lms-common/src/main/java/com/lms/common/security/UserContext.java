package com.lms.common.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserContext {
  private String userId;
  private String username;
  private List<String> roles;
  private Long organizationId;

  public boolean hasRole(String role) {
    return roles != null && roles.contains(role);
  }

  public boolean hasAnyRole(String... roles) {
    if (this.roles == null)
      return false;
    for (String role : roles) {
      if (this.roles.contains(role)) {
        return true;
      }
    }
    return false;
  }

  public boolean isAdmin() {
    return hasRole("ADMIN");
  }

  public boolean isInstructor() {
    return hasRole("INSTRUCTOR");
  }

  public boolean isStudent() {
    return hasRole("STUDENT");
  }
}
