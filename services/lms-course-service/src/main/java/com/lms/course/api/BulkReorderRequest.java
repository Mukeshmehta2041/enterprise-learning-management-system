package com.lms.course.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record BulkReorderRequest(
    @NotNull List<ReorderItem> items) {
  public record ReorderItem(
      @NotNull UUID id,
      @NotNull Integer sortOrder) {
  }
}
