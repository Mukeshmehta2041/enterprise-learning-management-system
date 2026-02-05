package com.lms.common.config;

import com.lms.common.security.RBACEnforcer;
import com.lms.common.security.UserContextFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ConditionalOnWebApplication
@Import(ObservabilityConfig.class)
public class SharedAutoConfiguration {

  @Bean
  public UserContextFilter userContextFilter() {
    return new UserContextFilter();
  }

  @Bean
  public RBACEnforcer rbacEnforcer() {
    return new RBACEnforcer();
  }
}
