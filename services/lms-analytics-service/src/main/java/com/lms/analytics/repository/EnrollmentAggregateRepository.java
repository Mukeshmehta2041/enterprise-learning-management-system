package com.lms.analytics.repository;

import com.lms.analytics.dto.EnrollmentTrendDTO;
import com.lms.analytics.model.EnrollmentAggregate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentAggregateRepository extends JpaRepository<EnrollmentAggregate, Long> {
  Optional<EnrollmentAggregate> findByCourseIdAndDate(Long courseId, LocalDate date);

  List<EnrollmentAggregate> findByCourseId(Long courseId);

  @Query("SELECT new com.lms.analytics.dto.EnrollmentTrendDTO(e.date, SUM(CAST(e.totalEnrollments AS long))) " +
      "FROM EnrollmentAggregate e " +
      "GROUP BY e.date " +
      "ORDER BY e.date ASC")
  List<EnrollmentTrendDTO> findEnrollmentTrends();

  @Query("SELECT SUM(CAST(e.totalEnrollments AS long)) FROM EnrollmentAggregate e")
  Long sumTotalEnrollments();

  @Query("SELECT COUNT(DISTINCT e.courseId) FROM EnrollmentAggregate e")
  Long countDistinctCourses();

  @Query("SELECT SUM(CAST(e.activeEnrollments AS long)) FROM EnrollmentAggregate e WHERE e.date >= :since")
  Long sumActiveEnrollmentsSince(LocalDate since);

  @Query("SELECT e.courseId, SUM(CAST(e.totalEnrollments AS long)), SUM(CAST(e.completedEnrollments AS long)) " +
      "FROM EnrollmentAggregate e " +
      "GROUP BY e.courseId")
  List<Object[]> findCourseEnrollmentStats();
}
