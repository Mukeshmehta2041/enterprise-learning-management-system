package com.lms.course.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {

  Optional<Course> findBySlug(String slug);

  Page<Course> findByStatus(CourseStatus status, Pageable pageable);

  long countByStatus(CourseStatus status);

  @Query("SELECT c FROM Course c WHERE c.status = :status ORDER BY c.createdAt DESC")
  Page<Course> findByStatusOrderByCreatedAtDesc(@Param("status") CourseStatus status, Pageable pageable);

  List<Course> findByStatusAndCreatedAtLessThanOrderByCreatedAtDesc(CourseStatus status, Instant createdAt,
      Pageable pageable);

  List<Course> findByCreatedAtLessThanOrderByCreatedAtDesc(Instant createdAt, Pageable pageable);

  boolean existsBySlug(String slug);

  @Query("SELECT CASE WHEN COUNT(ci) > 0 THEN true ELSE false END " +
      "FROM CourseInstructor ci WHERE ci.course.id = :courseId AND ci.userId = :userId")
  boolean isUserInstructor(@Param("courseId") UUID courseId, @Param("userId") UUID userId);

  @Query("SELECT DISTINCT c FROM Course c LEFT JOIN c.instructors ci " +
      "WHERE (c.status = 'PUBLISHED' OR ci.userId = :userId) " +
      "AND c.createdAt < :createdAt ORDER BY c.createdAt DESC")
  List<Course> findPublishedOrInstructor(@Param("userId") UUID userId, @Param("createdAt") Instant createdAt,
      Pageable pageable);

  @Query("SELECT c FROM Course c JOIN c.instructors ci " +
      "WHERE ci.userId = :userId AND c.createdAt < :createdAt ORDER BY c.createdAt DESC")
  List<Course> findByInstructorId(@Param("userId") UUID userId, @Param("createdAt") Instant createdAt,
      Pageable pageable);
}
