package com.lms.enrollment.domain;

import jakarta.persistence.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "lesson_progress", schema = "lms_enrollment")
@EntityListeners(AuditingEntityListener.class)
public class LessonProgress {

  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "enrollment_id", nullable = false)
  private Enrollment enrollment;

  @Column(name = "lesson_id", nullable = false)
  private UUID lessonId;

  @Column(name = "completed", nullable = false)
  private boolean completed = false;

  @Column(name = "completed_at")
  private Instant completedAt;

  @LastModifiedDate
  @Column(name = "last_accessed_at", nullable = false)
  private Instant lastAccessedAt;

  protected LessonProgress() {
  }

  public LessonProgress(UUID id, Enrollment enrollment, UUID lessonId) {
    this.id = id;
    this.enrollment = enrollment;
    this.lessonId = lessonId;
    this.completed = false;
  }

  public UUID getId() {
    return id;
  }

  public Enrollment getEnrollment() {
    return enrollment;
  }

  public UUID getLessonId() {
    return lessonId;
  }

  public boolean isCompleted() {
    return completed;
  }

  public Instant getCompletedAt() {
    return completedAt;
  }

  public Instant getLastAccessedAt() {
    return lastAccessedAt;
  }

  public void markCompleted() {
    if (!this.completed) {
      this.completed = true;
      this.completedAt = Instant.now();
    }
  }
}
