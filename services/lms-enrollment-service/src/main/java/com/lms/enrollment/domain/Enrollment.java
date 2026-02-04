package com.lms.enrollment.domain;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "enrollments", schema = "lms_enrollment")
@EntityListeners(AuditingEntityListener.class)
public class Enrollment {

  @Id
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "course_id", nullable = false)
  private UUID courseId;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 50)
  private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

  @Column(name = "progress_pct", nullable = false, precision = 5, scale = 2)
  private BigDecimal progressPct = BigDecimal.ZERO;

  @CreatedDate
  @Column(name = "enrolled_at", nullable = false, updatable = false)
  private Instant enrolledAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @Column(name = "completed_at")
  private Instant completedAt;

  @OneToMany(mappedBy = "enrollment", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<LessonProgress> lessonProgress = new ArrayList<>();

  protected Enrollment() {
  }

  public Enrollment(UUID id, UUID userId, UUID courseId) {
    this.id = id;
    this.userId = userId;
    this.courseId = courseId;
    this.status = EnrollmentStatus.ENROLLED;
    this.progressPct = BigDecimal.ZERO;
  }

  // Getters and setters
  public UUID getId() {
    return id;
  }

  public UUID getUserId() {
    return userId;
  }

  public UUID getCourseId() {
    return courseId;
  }

  public EnrollmentStatus getStatus() {
    return status;
  }

  public void setStatus(EnrollmentStatus status) {
    this.status = status;
  }

  public BigDecimal getProgressPct() {
    return progressPct;
  }

  public void setProgressPct(BigDecimal progressPct) {
    this.progressPct = progressPct;
  }

  public Instant getEnrolledAt() {
    return enrolledAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public Instant getCompletedAt() {
    return completedAt;
  }

  public void setCompletedAt(Instant completedAt) {
    this.completedAt = completedAt;
  }

  public List<LessonProgress> getLessonProgress() {
    return lessonProgress;
  }

  public void updateProgress(int completedLessons, int totalLessons) {
    if (totalLessons > 0) {
      this.progressPct = BigDecimal.valueOf((double) completedLessons / totalLessons * 100)
          .setScale(2, RoundingMode.HALF_UP);
    } else {
      this.progressPct = BigDecimal.ZERO;
    }

    if (this.progressPct.compareTo(BigDecimal.valueOf(100)) >= 0) {
      this.status = EnrollmentStatus.COMPLETED;
      this.completedAt = Instant.now();
    }
  }
}
