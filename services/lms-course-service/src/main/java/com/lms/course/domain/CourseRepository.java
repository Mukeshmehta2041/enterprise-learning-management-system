package com.lms.course.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {

  Optional<Course> findBySlug(String slug);

  Page<Course> findByStatus(CourseStatus status, Pageable pageable);

  @Query("SELECT c FROM Course c WHERE c.status = :status ORDER BY c.createdAt DESC")
  Page<Course> findByStatusOrderByCreatedAtDesc(@Param("status") CourseStatus status, Pageable pageable);

  boolean existsBySlug(String slug);

  @Query("SELECT CASE WHEN COUNT(ci) > 0 THEN true ELSE false END " +
      "FROM CourseInstructor ci WHERE ci.course.id = :courseId AND ci.userId = :userId")
  boolean isUserInstructor(@Param("courseId") UUID courseId, @Param("userId") UUID userId);
}
