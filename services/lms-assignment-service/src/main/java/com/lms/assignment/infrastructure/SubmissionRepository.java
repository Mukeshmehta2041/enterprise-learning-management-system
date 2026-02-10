package com.lms.assignment.infrastructure;

import com.lms.assignment.domain.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
  Optional<Submission> findByAssignmentIdAndStudentId(UUID assignmentId, UUID studentId);

  List<Submission> findByAssignmentId(UUID assignmentId);

  List<Submission> findAllByStudentId(UUID studentId);

  void deleteAllByStudentId(UUID studentId);
}
