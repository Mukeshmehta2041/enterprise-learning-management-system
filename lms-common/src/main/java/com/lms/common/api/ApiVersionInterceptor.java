package com.lms.common.api;

import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ApiVersionInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    String accept = request.getHeader("Accept");

    if (accept != null && accept.contains("application/vnd.lms.v1")) {
      response.setHeader("Deprecation", "true");
      response.setHeader("Sunset", "Mon, 01 Jan 2027 00:00:00 GMT");
      response.setHeader("Warning", "299 - \"API v1 is deprecated, use v2 instead\"");
    }

    return true;
  }
}
