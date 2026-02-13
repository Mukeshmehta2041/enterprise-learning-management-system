package com.lms.assignment.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class UpdateAssignmentRequest {
  @NotBlank
  private String title;

  private String description;

  private OffsetDateTime dueDate;

  @NotNull
  private Integer maxScore;

  private Boolean isMandatory;

  private UUID moduleId;

  private UUID lessonId;
}
