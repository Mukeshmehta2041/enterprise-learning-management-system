package com.lms.assignment.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grades", schema = "lms_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {
  @Id
  private UUID id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "submission_id", nullable = false)
  private Submission submission;

  @Column(nullable = false)
  private Integer score;

  @Column(columnDefinition = "TEXT")
  private String feedback;

  @Column(name = "instructor_id", nullable = false)
  private UUID instructorId;

  @CreationTimestamp
  @Column(name = "graded_at", nullable = false, updatable = false)
  private OffsetDateTime gradedAt;
}
