package com.lms.course.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {

  List<Lesson> findByModuleIdOrderBySortOrder(UUID moduleId);

  @Query("SELECT l FROM Lesson l WHERE l.module.id = :moduleId ORDER BY l.sortOrder ASC")
  List<Lesson> findByModuleId(@Param("moduleId") UUID moduleId);

  void deleteByModuleId(UUID moduleId);
}
