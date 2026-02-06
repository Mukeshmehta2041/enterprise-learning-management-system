package com.lms.assignment.infrastructure;

import com.lms.assignment.domain.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, UUID> {
  Optional<Grade> findBySubmissionId(UUID submissionId);

  void deleteBySubmissionStudentId(UUID studentId);
}
