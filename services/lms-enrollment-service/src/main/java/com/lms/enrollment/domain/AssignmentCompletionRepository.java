package com.lms.enrollment.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AssignmentCompletionRepository extends JpaRepository<AssignmentCompletion, UUID> {
  List<AssignmentCompletion> findAllByEnrollmentId(UUID enrollmentId);

  boolean existsByEnrollmentIdAndAssignmentId(UUID enrollmentId, UUID assignmentId);
}
