package com.lms.course.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record SyncCurriculumRequest(
    @NotNull @Valid List<ModuleSyncRequest> modules) {

  public record ModuleSyncRequest(
      UUID id, // Optional, null for new
      @NotBlank String title,
      Integer sortOrder,
      @NotNull @Valid List<LessonSyncRequest> lessons) {
  }

  public record LessonSyncRequest(
      UUID id, // Optional, null for new
      @NotBlank String title,
      @NotNull String type,
      Integer durationMinutes,
      Integer sortOrder,
      boolean isPreview) {
  }
}
