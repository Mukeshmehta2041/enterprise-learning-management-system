package com.lms.common.resilience;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnProperty(name = "lms.chaos.enabled", havingValue = "true")
public class ChaosFilter extends OncePerRequestFilter {

  private static final AtomicLong LATENCY_MS = new AtomicLong(0);
  private static final AtomicInteger ERROR_CODE = new AtomicInteger(0);

  public static void setLatency(long millis) {
    LATENCY_MS.set(millis);
  }

  public static void setErrorCode(int code) {
    ERROR_CODE.set(code);
  }

  public static void reset() {
    LATENCY_MS.set(0);
    ERROR_CODE.set(0);
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    if (request.getRequestURI().contains("/api/v1/chaos")) {
      filterChain.doFilter(request, response);
      return;
    }

    long latency = LATENCY_MS.get();
    if (latency > 0) {
      log.warn("Chaos: injecting latency of {}ms", latency);
      try {
        Thread.sleep(latency);
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }

    int errorCode = ERROR_CODE.get();
    if (errorCode > 0) {
      log.warn("Chaos: injecting error code {}", errorCode);
      response.sendError(errorCode, "Chaos injected error");
      return;
    }

    filterChain.doFilter(request, response);
  }
}
