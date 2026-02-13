package com.lms.assignment.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "assignments", schema = "lms_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {
  @Id
  private UUID id;

  @Column(name = "course_id", nullable = false)
  private UUID courseId;

  @Column(name = "module_id")
  private UUID moduleId;

  @Column(name = "lesson_id")
  private UUID lessonId;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "due_date")
  private OffsetDateTime dueDate;

  @Column(name = "max_score", nullable = false)
  private Integer maxScore;

  @Column(name = "is_mandatory", nullable = false)
  @Builder.Default
  private boolean isMandatory = true;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;
}
