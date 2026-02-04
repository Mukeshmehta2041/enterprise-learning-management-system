package com.lms.course.domain;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "lessons", schema = "lms_course")
@EntityListeners(AuditingEntityListener.class)
public class Lesson {

  @Id
  @Column(name = "id", updatable = false, nullable = false)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "module_id", nullable = false)
  private CourseModule module;
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false, length = 50)
  private LessonType type;

  @Column(name = "duration_minutes")
  private Integer durationMinutes;

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder = 0;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected Lesson() {
  }

  public Lesson(UUID id, CourseModule module, String title, LessonType type, Integer durationMinutes,
      Integer sortOrder) {
    this.id = id;
    this.module = module;
    this.title = title;
    this.type = type;
    this.durationMinutes = durationMinutes;
    this.sortOrder = sortOrder != null ? sortOrder : 0;
  }

  public UUID getId() {
    return id;
  }

  public CourseModule getModule() {
    return module;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public LessonType getType() {
    return type;
  }

  public void setType(LessonType type) {
    this.type = type;
  }

  public Integer getDurationMinutes() {
    return durationMinutes;
  }

  public void setDurationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
  }

  public Integer getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(Integer sortOrder) {
    this.sortOrder = sortOrder;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
