package com.lms.assignment.application;

import com.lms.assignment.api.CreateAssignmentRequest;
import com.lms.assignment.api.GradeSubmissionRequest;
import com.lms.assignment.api.SubmitAssignmentRequest;
import com.lms.assignment.domain.Assignment;
import com.lms.assignment.domain.Grade;
import com.lms.assignment.domain.Submission;
import com.lms.assignment.infrastructure.AssignmentRepository;
import com.lms.assignment.infrastructure.GradeRepository;
import com.lms.assignment.infrastructure.SubmissionRepository;
import com.lms.common.exception.ResourceNotFoundException;
import com.lms.common.events.EventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final GradeRepository gradeRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public Assignment createAssignment(CreateAssignmentRequest request) {
        Assignment assignment = Assignment.builder()
                .id(UUID.randomUUID())
                .courseId(request.getCourseId())
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .maxScore(request.getMaxScore())
                .build();
        Assignment saved = assignmentRepository.save(assignment);
        
        // Notify via Kafka
        kafkaTemplate.send("assignment.events", saved.getId().toString(), EventEnvelope.of(
            "AssignmentCreated",
            saved.getId().toString(),
            Map.of("courseId", saved.getCourseId()),
            null
        ));

        return saved;
    }

    @Transactional
    public Submission submitAssignment(UUID assignmentId, UUID studentId, SubmitAssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Submission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId)
                .orElse(Submission.builder()
                        .id(UUID.randomUUID())
                        .assignment(assignment)
                        .studentId(studentId)
                        .build());

        submission.setContent(request.getContent());
        submission.setStatus(Submission.SubmissionStatus.SUBMITTED);
        Submission saved = submissionRepository.save(submission);

        // Notify via Kafka
        kafkaTemplate.send("assignment.events", saved.getId().toString(), EventEnvelope.of(
            "SubmissionReceived",
            saved.getId().toString(),
            Map.of("assignmentId", assignmentId, "studentId", studentId),
            null
        ));
        
        return saved;
    }

    @Transactional
    public Grade gradeSubmission(UUID submissionId, UUID instructorId, GradeSubmissionRequest request) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        if (request.getScore() > submission.getAssignment().getMaxScore()) {
            throw new IllegalArgumentException("Score cannot exceed max score");
        }

        Grade grade = gradeRepository.findBySubmissionId(submissionId)
                .orElse(Grade.builder()
                        .id(UUID.randomUUID())
                        .submission(submission)
                        .build());

        grade.setScore(request.getScore());
        grade.setFeedback(request.getFeedback());
        grade.setInstructorId(instructorId);
        Grade saved = gradeRepository.save(grade);

        submission.setStatus(Submission.SubmissionStatus.GRADED);
        submissionRepository.save(submission);

        // Notify via Kafka
        kafkaTemplate.send("assignment.events", saved.getId().toString(), EventEnvelope.of(
            "AssignmentGraded",
            saved.getId().toString(),
            Map.of("submissionId", submissionId, "score", saved.getScore()),
            null
        ));

        return saved;
    }

    public List<Assignment> getAssignmentsByCourse(UUID courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public List<Submission> getSubmissionsByAssignment(UUID assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }
}
