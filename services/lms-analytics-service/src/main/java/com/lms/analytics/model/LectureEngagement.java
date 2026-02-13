package com.lms.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "lecture_engagement")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureEngagement {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "lesson_id", nullable = false)
  private UUID lessonId;

  @Column(name = "course_id", nullable = false)
  private UUID courseId;

  @Column(name = "total_watches")
  private Integer totalWatches = 0;

  @Column(name = "total_completes")
  private Integer totalCompletes = 0;

  @Column(name = "total_watch_time_secs")
  private Long totalWatchTimeSecs = 0L;

  @Column(name = "avg_watch_time_secs")
  private Double avgWatchTimeSecs = 0.0;

  @Column(nullable = false)
  private LocalDate date;

  public void incrementWatches() {
    this.totalWatches = (this.totalWatches == null ? 0 : this.totalWatches) + 1;
  }

  public void incrementCompletes() {
    this.totalCompletes = (this.totalCompletes == null ? 0 : this.totalCompletes) + 1;
  }

  public void addWatchTime(long secs) {
    this.totalWatchTimeSecs = (this.totalWatchTimeSecs == null ? 0L : this.totalWatchTimeSecs) + secs;
    if (this.totalWatches != null && this.totalWatches > 0) {
      this.avgWatchTimeSecs = (double) this.totalWatchTimeSecs / this.totalWatches;
    }
  }
}
