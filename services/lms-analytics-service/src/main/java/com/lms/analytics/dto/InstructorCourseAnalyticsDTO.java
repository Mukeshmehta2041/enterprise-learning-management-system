package com.lms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstructorCourseAnalyticsDTO {
  private UUID courseId;
  private String courseTitle;
  private Integer totalEnrollments;
  private Integer activeEnrollments;
  private Integer completedEnrollments;
  private Double averageCompletionRate;
  private List<LessonEngagementDTO> lessonMetrics;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class LessonEngagementDTO {
    private UUID lessonId;
    private String lessonTitle;
    private Integer totalWatches;
    private Integer totalCompletes;
    private Double completionRate;
    private Double averageWatchTimeSecs;
  }
}
