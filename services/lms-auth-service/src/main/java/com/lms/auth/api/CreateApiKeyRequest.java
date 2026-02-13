package com.lms.auth.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class CreateApiKeyRequest {

  @NotBlank(message = "API key name is required")
  private String name;

  @NotEmpty(message = "At least one scope is required")
  private Set<String> scopes;
}
