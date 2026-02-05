package com.lms.common.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class ApiVersion {
  public static final String V1 = "application/vnd.lms.v1+json";
  public static final String V2 = "application/vnd.lms.v2+json";

  public static String deprecated(String version, String replacement) {
    return String.format("API version %s is deprecated. Please use %s instead", version, replacement);
  }
}
