package com.lms.analytics.repository;

import com.lms.analytics.model.EventSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventSnapshotRepository extends JpaRepository<EventSnapshot, Long> {
  List<EventSnapshot> findByEventType(String eventType);
  List<EventSnapshot> findByDate(LocalDate date);
  List<EventSnapshot> findByEventTypeAndDate(String eventType, LocalDate date);
}
