package com.lms.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "export_jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportJob {
  @Id
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "report_type", nullable = false)
  private String reportType;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private JobStatus status;

  @Column(name = "download_url")
  private String downloadUrl;

  @Column(name = "error_message")
  private String errorMessage;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "completed_at")
  private Instant completedAt;

  public enum JobStatus {
    PENDING, PROCESSING, COMPLETED, FAILED
  }
}
