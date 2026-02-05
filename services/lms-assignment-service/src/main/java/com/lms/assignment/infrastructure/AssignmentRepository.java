package com.lms.assignment.infrastructure;

import com.lms.assignment.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByCourseId(UUID courseId);
}
