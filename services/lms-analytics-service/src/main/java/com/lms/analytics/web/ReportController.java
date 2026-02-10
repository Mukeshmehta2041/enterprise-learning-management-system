package com.lms.analytics.web;

import com.lms.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

  private final AnalyticsService analyticsService;

  @PostMapping("/enrollment-summary")
  @Operation(summary = "Request a bulk enrollment report", description = "Triggers an asynchronous generation of a CSV report.")
  public ResponseEntity<Map<String, String>> requestEnrollmentReport(
      @RequestParam(required = false) UUID courseId,
      @RequestHeader("X-User-Id") UUID userId) {

    // In a real implementation, this would:
    // 1. Create a record in a ReportRequests table
    // 2. Send a message to Kafka or trigger an async @Service method
    // 3. Return the request ID

    log.info("Report requested by user: {} for course: {}", userId, courseId);

    return ResponseEntity.accepted().body(Map.of(
        "requestId", UUID.randomUUID().toString(),
        "status", "PROCESSING",
        "message", "Report generation started. You will be notified when it's ready."));
  }

  @GetMapping("/{requestId}")
  public ResponseEntity<Map<String, String>> getReportStatus(@PathVariable String requestId) {
    // Mocking polling
    return ResponseEntity.ok(Map.of(
        "requestId", requestId,
        "status", "COMPLETED",
        "downloadUrl", "https://s3.lms.com/reports/enrollment-" + requestId + ".csv"));
  }
}
