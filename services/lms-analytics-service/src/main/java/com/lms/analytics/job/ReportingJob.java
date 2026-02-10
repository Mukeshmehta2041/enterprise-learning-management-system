package com.lms.analytics.job;

import com.lms.analytics.service.AnalyticsService;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
public class ReportingJob {

  @Autowired
  private AnalyticsService analyticsService;

  /**
   * Daily enrollment aggregation and reporting.
   * Runs at 01:00 AM every day.
   */
  @Scheduled(cron = "0 0 1 * * *")
  @SchedulerLock(name = "enrollmentReportJob", lockAtLeastFor = "5m", lockAtMostFor = "30m")
  public void generateDailyReport() {
    log.info("Starting Daily Enrollment Report Job...");

    LocalDate yesterday = LocalDate.now().minusDays(1);
    try {
      // In a real app, this might generate a CSV and upload to S3 or send an email
      // summary
      // For now, we simulate the logic of finalizing aggregates
      log.info("Finalizing data for {}", yesterday);
      long totalEnrollments = analyticsService.getEnrollmentTrends().stream()
          .mapToLong(t -> t.getCount() != null ? t.getCount() : 0L)
          .sum();

      log.info("Daily Report Summary for {}: Total Enrollments across all courses: {}", yesterday, totalEnrollments);

      // metrics for job success
      log.info("Daily Enrollment Report Job completed successfully.");
    } catch (Exception e) {
      log.error("Error during Daily Enrollment Report Job", e);
    }
  }
}
