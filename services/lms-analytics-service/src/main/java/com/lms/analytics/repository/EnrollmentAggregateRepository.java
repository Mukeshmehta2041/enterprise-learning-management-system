package com.lms.analytics.repository;

import com.lms.analytics.model.EnrollmentAggregate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentAggregateRepository extends JpaRepository<EnrollmentAggregate, Long> {
  Optional<EnrollmentAggregate> findByCourseIdAndDate(Long courseId, LocalDate date);
  List<EnrollmentAggregate> findByCourseId(Long courseId);
}
