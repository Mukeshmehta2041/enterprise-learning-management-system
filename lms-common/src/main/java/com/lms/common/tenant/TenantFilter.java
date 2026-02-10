package com.lms.common.tenant;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class TenantFilter implements Filter {

  private static final String HEADER_TENANT_ID = "X-Tenant-Id";

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    String tenantIdHeader = httpRequest.getHeader(HEADER_TENANT_ID);

    if (tenantIdHeader != null && !tenantIdHeader.isBlank()) {
      try {
        TenantContext.setTenantId(UUID.fromString(tenantIdHeader));
      } catch (IllegalArgumentException e) {
        // Invalid UUID
      }
    }

    try {
      chain.doFilter(request, response);
    } finally {
      TenantContext.clear();
    }
  }
}
