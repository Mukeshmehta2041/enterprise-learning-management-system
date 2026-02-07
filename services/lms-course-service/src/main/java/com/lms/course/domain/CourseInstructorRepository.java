package com.lms.course.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CourseInstructorRepository extends JpaRepository<CourseInstructor, CourseInstructorId> {
  void deleteByUserId(UUID userId);

  long countByUserId(UUID userId);
}
