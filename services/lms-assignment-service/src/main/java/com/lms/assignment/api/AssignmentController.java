package com.lms.assignment.api;

import com.lms.assignment.application.AssignmentService;
import com.lms.assignment.domain.Assignment;
import com.lms.assignment.domain.Grade;
import com.lms.assignment.domain.Submission;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Assignment createAssignment(@RequestBody @Valid CreateAssignmentRequest request) {
        return assignmentService.createAssignment(request);
    }

    @GetMapping("/course/{courseId}")
    public List<Assignment> getAssignmentsByCourse(@PathVariable UUID courseId) {
        return assignmentService.getAssignmentsByCourse(courseId);
    }

    @PostMapping("/{assignmentId}/submit")
    @ResponseStatus(HttpStatus.CREATED)
    public Submission submitAssignment(
            @PathVariable UUID assignmentId,
            @RequestHeader("X-User-Id") UUID studentId,
            @RequestBody @Valid SubmitAssignmentRequest request) {
        return assignmentService.submitAssignment(assignmentId, studentId, request);
    }

    @GetMapping("/{assignmentId}/submissions")
    public List<Submission> getSubmissions(@PathVariable UUID assignmentId) {
        return assignmentService.getSubmissionsByAssignment(assignmentId);
    }

    @PostMapping("/submissions/{submissionId}/grade")
    public Grade gradeSubmission(
            @PathVariable UUID submissionId,
            @RequestHeader("X-User-Id") UUID instructorId,
            @RequestBody @Valid GradeSubmissionRequest request) {
        return assignmentService.gradeSubmission(submissionId, instructorId, request);
    }
}
