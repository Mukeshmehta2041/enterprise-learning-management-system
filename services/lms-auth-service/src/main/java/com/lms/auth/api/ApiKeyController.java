package com.lms.auth.api;

import com.lms.auth.service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

  private final ApiKeyService apiKeyService;

  @PostMapping
  public ResponseEntity<ApiKeyService.ApiKeyCreateResponse> createApiKey(
      @RequestHeader("X-User-Id") String userId,
      @Valid @RequestBody CreateApiKeyRequest request) {
    return ResponseEntity.ok(apiKeyService.createApiKey(
        UUID.fromString(userId),
        request.getName(),
        request.getScopes()));
  }

  @GetMapping
  public ResponseEntity<List<ApiKeyService.ApiKeySummary>> getMyApiKeys(
      @RequestHeader("X-User-Id") String userId) {
    return ResponseEntity.ok(apiKeyService.getUserApiKeys(UUID.fromString(userId)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> revokeApiKey(
      @RequestHeader("X-User-Id") String userId,
      @PathVariable UUID id) {
    apiKeyService.revokeApiKey(id, UUID.fromString(userId));
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/validate")
  public ResponseEntity<ApiKeyService.ApiKeyValidation> validateKey(@RequestParam String key) {
    return apiKeyService.validateKey(key)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.status(401).build());
  }
}
