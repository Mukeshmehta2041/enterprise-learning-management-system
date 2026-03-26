package com.lms.user.application;

public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(String roleName) {
        super("Role not found: " + roleName);
    }
}
