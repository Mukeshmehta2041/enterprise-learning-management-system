package com.lms.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "enrollment_aggregates", indexes = {
    @Index(name = "idx_course_id", columnList = "course_id"),
    @Index(name = "idx_date", columnList = "date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentAggregate {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "course_id")
  private Long courseId;

  @Column(name = "total_enrollments")
  private Integer totalEnrollments;

  @Column(name = "active_enrollments")
  private Integer activeEnrollments;

  @Column(name = "completed_enrollments")
  private Integer completedEnrollments;

  @Column(nullable = false)
  private LocalDate date;

  public void incrementTotal() {
    this.totalEnrollments = (this.totalEnrollments != null ? this.totalEnrollments : 0) + 1;
  }

  public void incrementActive() {
    this.activeEnrollments = (this.activeEnrollments != null ? this.activeEnrollments : 0) + 1;
  }

  public void incrementCompleted() {
    this.completedEnrollments = (this.completedEnrollments != null ? this.completedEnrollments : 0) + 1;
  }
}
