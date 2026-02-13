package com.lms.analytics.repository;

import com.lms.analytics.model.ExportJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ExportJobRepository extends JpaRepository<ExportJob, UUID> {
  List<ExportJob> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
