package com.lms.course.api;

import com.lms.common.features.FeatureFlagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/internal/features")
@RequiredArgsConstructor
@Tag(name = "Internal Feature Flags", description = "Endpoints for hot-toggling feature flags")
public class FeatureFlagController {

  private final FeatureFlagService featureFlagService;

  @GetMapping("/{name}")
  @Operation(summary = "Check if a feature is enabled")
  public Map<String, Boolean> isEnabled(@PathVariable String name) {
    return Map.of("enabled", featureFlagService.isEnabled(name));
  }

  @PostMapping("/{name}/override")
  @Operation(summary = "Override a feature flag status in Redis")
  public void setOverride(@PathVariable String name, @RequestParam boolean enabled) {
    featureFlagService.setOverride(name, enabled);
  }

  @DeleteMapping("/{name}/override")
  @Operation(summary = "Remove Redis override and fallback to static config")
  public void removeOverride(@PathVariable String name) {
    featureFlagService.removeOverride(name);
  }
}
