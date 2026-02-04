package com.lms.course.domain;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "course_instructors", schema = "lms_course")
@EntityListeners(AuditingEntityListener.class)
@IdClass(CourseInstructorId.class)
public class CourseInstructor {

  @Id
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id", nullable = false)
  private Course course;

  @Id
  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "role", nullable = false, length = 50)
  private String role = "INSTRUCTOR";

  @CreatedDate
  @Column(name = "assigned_at", nullable = false, updatable = false)
  private Instant assignedAt;

  protected CourseInstructor() {
  }

  public CourseInstructor(Course course, UUID userId, String role) {
    this.course = course;
    this.userId = userId;
    this.role = role != null ? role : "INSTRUCTOR";
  }

  public Course getCourse() {
    return course;
  }

  public UUID getUserId() {
    return userId;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public Instant getAssignedAt() {
    return assignedAt;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (!(o instanceof CourseInstructor))
      return false;
    CourseInstructor that = (CourseInstructor) o;
    return Objects.equals(course.getId(), that.course.getId()) &&
        Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(course.getId(), userId);
  }
}

class CourseInstructorId implements Serializable {
  private UUID course;
  private UUID userId;

  public CourseInstructorId() {
  }

  public CourseInstructorId(UUID course, UUID userId) {
    this.course = course;
    this.userId = userId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (!(o instanceof CourseInstructorId))
      return false;
    CourseInstructorId that = (CourseInstructorId) o;
    return Objects.equals(course, that.course) &&
        Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(course, userId);
  }
}
