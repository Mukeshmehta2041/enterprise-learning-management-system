package com.lms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseAnalyticsDTO {
  private String courseId;
  private String courseTitle;
  private Long totalEnrollments;
  private Double completionRate;
  private Double averageRating;
  private Double revenue;
}
