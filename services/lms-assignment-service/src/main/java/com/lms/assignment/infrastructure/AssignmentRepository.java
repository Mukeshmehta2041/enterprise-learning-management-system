package com.lms.assignment.infrastructure;

import com.lms.assignment.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

import java.time.OffsetDateTime;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
  List<Assignment> findByCourseId(UUID courseId);

  List<Assignment> findByModuleId(UUID moduleId);

  List<Assignment> findByLessonId(UUID lessonId);

  List<Assignment> findByDueDateBetween(OffsetDateTime start, OffsetDateTime end);
}
