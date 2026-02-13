package com.lms.assignment.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class CreateAssignmentRequest {
  @NotNull
  private UUID courseId;
  private UUID moduleId;
  private UUID lessonId;
  @NotBlank
  private String title;
  private String description;
  private OffsetDateTime dueDate;
  private Integer maxScore = 100;
  private boolean isMandatory = true;
}
