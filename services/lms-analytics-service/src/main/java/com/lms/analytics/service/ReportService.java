package com.lms.analytics.service;

import com.lms.analytics.model.EnrollmentAggregate;
import com.lms.analytics.model.ExportJob;
import com.lms.analytics.model.LectureEngagement;
import com.lms.analytics.repository.EnrollmentAggregateRepository;
import com.lms.analytics.repository.ExportJobRepository;
import com.lms.analytics.repository.LectureEngagementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

  private final ExportJobRepository exportJobRepository;
  private final EnrollmentAggregateRepository enrollmentAggregateRepository;
  private final LectureEngagementRepository lectureEngagementRepository;

  public ExportJob createExportJob(UUID userId, String reportType) {
    ExportJob job = ExportJob.builder()
        .id(UUID.randomUUID())
        .userId(userId)
        .reportType(reportType)
        .status(ExportJob.JobStatus.PENDING)
        .createdAt(Instant.now())
        .build();
    return exportJobRepository.save(job);
  }

  @Async
  public void processExport(UUID jobId) {
    ExportJob job = exportJobRepository.findById(jobId).orElse(null);
    if (job == null)
      return;

    try {
      job.setStatus(ExportJob.JobStatus.PROCESSING);
      exportJobRepository.save(job);

      String csvData = "";
      if ("COURSE_OVERVIEW".equals(job.getReportType())) {
        csvData = generateCourseOverviewCsv();
      } else if ("LECTURE_ENGAGEMENT".equals(job.getReportType())) {
        csvData = generateLectureEngagementCsv();
      } else {
        throw new IllegalArgumentException("Unknown report type: " + job.getReportType());
      }

      // In a real system, we would upload this to S3 and store the URL.
      // For this project, we'll "mock" the upload and store the data in the URL field
      // as a data URI if small, or just a mock link.
      job.setDownloadUrl("https://storage.lms.com/reports/" + jobId + ".csv");
      job.setStatus(ExportJob.JobStatus.COMPLETED);
      job.setCompletedAt(Instant.now());
      exportJobRepository.save(job);

      log.info("Export job {} completed successfully", jobId);
    } catch (Exception e) {
      log.error("Export job {} failed", jobId, e);
      job.setStatus(ExportJob.JobStatus.FAILED);
      job.setErrorMessage(e.getMessage());
      exportJobRepository.save(job);
    }
  }

  private String generateCourseOverviewCsv() {
    List<EnrollmentAggregate> records = enrollmentAggregateRepository.findAll();
    StringBuilder sb = new StringBuilder();
    sb.append("Course ID,Date,Total Enrollments,Active Enrollments,Completed Enrollments\n");
    for (EnrollmentAggregate rec : records) {
      sb.append(rec.getCourseId()).append(",")
          .append(rec.getDate()).append(",")
          .append(rec.getTotalEnrollments()).append(",")
          .append(rec.getActiveEnrollments()).append(",")
          .append(rec.getCompletedEnrollments()).append("\n");
    }
    return sb.toString();
  }

  private String generateLectureEngagementCsv() {
    List<LectureEngagement> records = lectureEngagementRepository.findAll();
    StringBuilder sb = new StringBuilder();
    sb.append("Lesson ID,Course ID,Date,Total Watches,Total Completes,Total Watch Time (s),Avg Watch Time (s)\n");
    for (LectureEngagement rec : records) {
      sb.append(rec.getLessonId()).append(",")
          .append(rec.getCourseId()).append(",")
          .append(rec.getDate()).append(",")
          .append(rec.getTotalWatches()).append(",")
          .append(rec.getTotalCompletes()).append(",")
          .append(rec.getTotalWatchTimeSecs()).append(",")
          .append(rec.getAvgWatchTimeSecs()).append("\n");
    }
    return sb.toString();
  }

  public List<ExportJob> getUserJobs(UUID userId) {
    return exportJobRepository.findByUserIdOrderByCreatedAtDesc(userId);
  }

  public ExportJob getJob(UUID jobId) {
    return exportJobRepository.findById(jobId).orElse(null);
  }
}
