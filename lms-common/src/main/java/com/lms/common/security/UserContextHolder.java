package com.lms.common.security;

public class UserContextHolder {
  private static final ThreadLocal<UserContext> THREAD_LOCAL = new ThreadLocal<>();

  public static void setContext(UserContext context) {
    THREAD_LOCAL.set(context);
  }

  public static UserContext getContext() {
    return THREAD_LOCAL.get();
  }

  public static void clearContext() {
    THREAD_LOCAL.remove();
  }
}
