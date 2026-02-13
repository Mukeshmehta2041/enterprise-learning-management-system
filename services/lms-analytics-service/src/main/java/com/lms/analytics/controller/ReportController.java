package com.lms.analytics.controller;

import com.lms.analytics.model.ExportJob;
import com.lms.analytics.service.ReportService;
import com.lms.common.security.RBACEnforcer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics/reports")
@RequiredArgsConstructor
public class ReportController {

  private final ReportService reportService;
  private final RBACEnforcer rbacEnforcer;
  private static final String HEADER_USER_ID = "X-User-Id";

  @PostMapping("/export")
  public ResponseEntity<ExportJob> triggerExport(
      @RequestHeader(HEADER_USER_ID) String userId,
      @RequestParam String type) {

    rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");

    ExportJob job = reportService.createExportJob(UUID.fromString(userId), type);
    reportService.processExport(job.getId());

    return ResponseEntity.accepted().body(job);
  }

  @GetMapping("/jobs")
  public ResponseEntity<List<ExportJob>> getMyJobs(@RequestHeader(HEADER_USER_ID) String userId) {
    rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    return ResponseEntity.ok(reportService.getUserJobs(UUID.fromString(userId)));
  }

  @GetMapping("/jobs/{jobId}")
  public ResponseEntity<ExportJob> getJob(@PathVariable UUID jobId) {
    rbacEnforcer.checkRole("ADMIN", "INSTRUCTOR");
    ExportJob job = reportService.getJob(jobId);
    if (job == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(job);
  }
}
