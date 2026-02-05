package com.lms.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "event_snapshots", indexes = {
    @Index(name = "idx_event_type", columnList = "event_type"),
    @Index(name = "idx_date", columnList = "date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSnapshot {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String eventType;

  @Column(columnDefinition = "TEXT")
  private String payload;

  @Column(nullable = false)
  private LocalDate date;

  @Column(name = "created_at")
  private Instant createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = Instant.now();
    if (date == null) {
      date = LocalDate.now();
    }
  }
}
