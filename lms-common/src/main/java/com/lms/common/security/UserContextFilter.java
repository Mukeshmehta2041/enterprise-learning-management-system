package com.lms.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class UserContextFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String userIdStr = request.getHeader("X-User-Id");
    String rolesStr = request.getHeader("X-Roles");

    if (StringUtils.hasText(userIdStr)) {
      UserContext.UserContextBuilder builder = UserContext.builder()
          .userId(userIdStr);

      if (StringUtils.hasText(rolesStr)) {
        List<String> roles = Arrays.stream(rolesStr.split(","))
            .map(String::trim)
            .collect(Collectors.toList());
        builder.roles(roles);
      }

      UserContext userContext = builder.build();
      request.setAttribute("userContext", userContext);
    }

    filterChain.doFilter(request, response);
  }
}
