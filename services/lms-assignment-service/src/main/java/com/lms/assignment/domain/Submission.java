package com.lms.assignment.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "submissions", schema = "lms_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assignment_id", nullable = false)
  private Assignment assignment;

  @Column(name = "student_id", nullable = false)
  private UUID studentId;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @CreationTimestamp
  @Column(name = "submitted_at", nullable = false, updatable = false)
  private OffsetDateTime submittedAt;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SubmissionStatus status;

  public enum SubmissionStatus {
    SUBMITTED, GRADED
  }
}
