package com.lms.notification.controller;

import com.lms.notification.model.WebhookHistory;
import com.lms.notification.model.WebhookSubscription;
import com.lms.notification.repository.WebhookHistoryRepository;
import com.lms.notification.repository.WebhookSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications/webhooks")
@RequiredArgsConstructor
public class WebhookController {

  private final WebhookSubscriptionRepository subscriptionRepository;
  private final WebhookHistoryRepository historyRepository;

  @PostMapping("/subscriptions")
  public ResponseEntity<WebhookSubscription> createSubscription(
      @RequestHeader(value = "X-Roles", required = false) String roles,
      @RequestBody WebhookSubscription subscription) {
    if (roles == null || !roles.contains("ADMIN")) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(subscriptionRepository.save(subscription));
  }

  @GetMapping("/subscriptions")
  public ResponseEntity<List<WebhookSubscription>> listSubscriptions(
      @RequestHeader(value = "X-Roles", required = false) String roles) {
    if (roles == null || !roles.contains("ADMIN")) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(subscriptionRepository.findAll());
  }

  @DeleteMapping("/subscriptions/{id}")
  public ResponseEntity<Void> deleteSubscription(
      @RequestHeader(value = "X-Roles", required = false) String roles,
      @PathVariable Long id) {
    if (roles == null || !roles.contains("ADMIN")) {
      return ResponseEntity.status(403).build();
    }
    subscriptionRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/history")
  public ResponseEntity<Page<WebhookHistory>> getHistory(
      @RequestHeader(value = "X-Roles", required = false) String roles,
      Pageable pageable) {
    if (roles == null || !roles.contains("ADMIN")) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(historyRepository.findAll(pageable));
  }

  @PatchMapping("/subscriptions/{id}/toggle")
  public ResponseEntity<WebhookSubscription> toggleSubscription(@PathVariable Long id) {
    WebhookSubscription sub = subscriptionRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Subscription not found"));
    sub.setActive(!sub.isActive());
    return ResponseEntity.ok(subscriptionRepository.save(sub));
  }
}
