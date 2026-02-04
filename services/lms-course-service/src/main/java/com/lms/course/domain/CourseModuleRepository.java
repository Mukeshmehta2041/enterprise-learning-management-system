package com.lms.course.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CourseModuleRepository extends JpaRepository<CourseModule, UUID> {

    List<CourseModule> findByCourseIdOrderBySortOrder(UUID courseId);

    @Query("SELECT m FROM CourseModule m WHERE m.course.id = :courseId ORDER BY m.sortOrder ASC")
    List<CourseModule> findByCourseId(@Param("courseId") UUID courseId);

  void deleteByCourseId(UUID courseId);
}
