package com.lms.notification.repository;

import com.lms.notification.model.WebhookHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WebhookHistoryRepository extends JpaRepository<WebhookHistory, UUID> {
}
