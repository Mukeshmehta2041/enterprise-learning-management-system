package com.lms.assignment.api;

import com.lms.assignment.application.AssignmentService;
import com.lms.assignment.domain.Submission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/internal/assignments")
@RequiredArgsConstructor
public class InternalAssignmentController {

  private final AssignmentService assignmentService;

  @GetMapping("/export")
  public ResponseEntity<List<Map<String, Object>>> exportByUserId(@RequestParam UUID userId) {
    List<Submission> submissions = assignmentService.getSubmissionsByStudentId(userId);

    List<Map<String, Object>> response = submissions.stream()
        .map(s -> {
          Map<String, Object> map = new HashMap<>();
          map.put("id", s.getId().toString());
          map.put("assignmentId", s.getAssignment().getId().toString());
          map.put("status", s.getStatus().name());
          map.put("submittedAt", s.getSubmittedAt().toString());
          map.put("content", s.getContent() != null ? s.getContent() : "");
          return map;
        })
        .collect(Collectors.toList());

    return ResponseEntity.ok(response);
  }
}
