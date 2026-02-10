package com.lms.common.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Locale;

public class LocaleFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String language = request.getHeader("Accept-Language");
    if (language != null && !language.isBlank()) {
      try {
        Locale.LanguageRange range = Locale.LanguageRange.parse(language).get(0);
        Locale locale = Locale.forLanguageTag(range.getRange());
        LocaleContextHolder.setLocale(locale);
      } catch (Exception e) {
        // Fallback to default if header is malformed
        LocaleContextHolder.setLocale(Locale.ENGLISH);
      }
    } else {
      LocaleContextHolder.setLocale(Locale.ENGLISH);
    }

    try {
      filterChain.doFilter(request, response);
    } finally {
      LocaleContextHolder.resetLocaleContext();
    }
  }
}
