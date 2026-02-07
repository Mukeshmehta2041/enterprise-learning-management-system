package com.lms.common.config;

import com.lms.common.audit.AuditLogger;
import com.lms.common.features.FeatureFlagProperties;
import com.lms.common.features.FeatureFlagService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
@Import({ ObservabilityConfig.class, FeatureFlagProperties.class })
public class SharedAutoConfiguration {

  @Bean
  public AuditLogger auditLogger(ObjectMapper objectMapper) {
    return new AuditLogger(objectMapper);
  }

  @Bean
  public FeatureFlagService featureFlagService(StringRedisTemplate redisTemplate, FeatureFlagProperties properties) {
    return new FeatureFlagService(redisTemplate, properties);
  }
}
