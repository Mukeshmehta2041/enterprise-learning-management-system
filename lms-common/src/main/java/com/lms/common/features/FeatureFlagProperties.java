package com.lms.common.features;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "lms.features")
public class FeatureFlagProperties {
  /**
   * Map of feature names to their enabled status.
   * Example properties:
   * lms.features.flags.new-enrollment-flow=true
   */
  private Map<String, Boolean> flags = new HashMap<>();
}
