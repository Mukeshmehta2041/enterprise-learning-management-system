package com.lms.enrollment.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
  Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);

  Page<Enrollment> findByUserId(UUID userId, Pageable pageable);

  long countByUserId(UUID userId);

  List<Enrollment> findByUserIdAndEnrolledAtLessThanOrderByEnrolledAtDesc(UUID userId, Instant enrolledAt,
      Pageable pageable);

  List<Enrollment> findByCourseIdAndEnrolledAtLessThanOrderByEnrolledAtDesc(UUID courseId, Instant enrolledAt,
      Pageable pageable);

  Page<Enrollment> findByCourseId(UUID courseId, Pageable pageable);

  boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);

  List<Enrollment> findAllByUserId(UUID userId);

  void deleteByUserId(UUID userId);
}
