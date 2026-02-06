package com.lms.notification.repository;

import com.lms.notification.model.WebhookSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookSubscriptionRepository extends JpaRepository<WebhookSubscription, Long> {
  List<WebhookSubscription> findAllByActiveTrue();

  List<WebhookSubscription> findAllByEventTypeAndActiveTrue(String eventType);
}
