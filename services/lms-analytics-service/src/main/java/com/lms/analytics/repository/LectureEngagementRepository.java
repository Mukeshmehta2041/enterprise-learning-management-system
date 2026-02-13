package com.lms.analytics.repository;

import com.lms.analytics.model.LectureEngagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LectureEngagementRepository extends JpaRepository<LectureEngagement, Long> {
  Optional<LectureEngagement> findByLessonIdAndDate(UUID lessonId, LocalDate date);

  List<LectureEngagement> findAllByCourseIdAndDateBetween(UUID courseId, LocalDate start, LocalDate end);

  List<LectureEngagement> findAllByCourseId(UUID courseId);
}
