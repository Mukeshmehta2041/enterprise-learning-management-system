package com.lms.common.config;

import com.lms.common.security.RBACEnforcer;
import com.lms.common.security.UserContextFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@ConditionalOnClass(name = "jakarta.servlet.Filter")
public class SharedWebMvcConfiguration {

  @Bean
  public UserContextFilter userContextFilter() {
    return new UserContextFilter();
  }

  @Bean
  public RBACEnforcer rbacEnforcer() {
    return new RBACEnforcer();
  }
}
