package com.lms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalStatsDTO {
  private Long totalStudents;
  private Long totalCourses;
  private Long totalEnrollments;
  private Double totalRevenue;
  private Long activeLearnersLast30Days;
}
