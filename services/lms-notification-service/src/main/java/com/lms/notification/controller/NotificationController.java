package com.lms.notification.controller;

import com.lms.common.security.RBACEnforcer;
import com.lms.common.security.UserContext;
import com.lms.notification.model.InAppNotification;
import com.lms.notification.service.NotificationStreamService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @Autowired
  private NotificationStreamService streamService;

  @Autowired(required = false)
  private RBACEnforcer rbacEnforcer;

  @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter streamNotifications(@RequestAttribute(required = false) UserContext userContext) {
    if (userContext == null || userContext.getUserId() == null) {
      log.warn("Unauthorized attempt to access notification stream");
      throw new RBACEnforcer.AccessDeniedException("Unauthorized");
    }
    return streamService.createEmitter(userContext.getUserId());
  }

  public record MarkAsReadRequest(List<String> notificationIds) {
  }

  @GetMapping
  public ResponseEntity<List<InAppNotification>> getMyNotifications(
      @RequestAttribute(required = false) UserContext userContext) {
    if (userContext == null || userContext.getUserId() == null) {
      log.warn("No user context found for notifications request");
      return ResponseEntity.ok(List.of());
    }
    return getUserNotifications(userContext.getUserId(), userContext);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<InAppNotification>> getUserNotifications(
      @PathVariable String userId,
      @RequestAttribute(required = false) UserContext userContext) {

    // RBAC: Users can only view their own notifications
    if (userContext != null && rbacEnforcer != null && !userContext.isAdmin()) {
      if (!userId.equals(userContext.getUserId())) {
        throw new RBACEnforcer.AccessDeniedException("You can only view your own notifications");
      }
    }

    String userKey = "notifications:" + userId;
    Set<Object> notificationIds = redisTemplate.opsForSet().members(userKey);

    List<InAppNotification> notifications = notificationIds.stream()
        .map(id -> (InAppNotification) redisTemplate.opsForValue()
            .get("notifications:" + userId + ":" + id))
        .filter(java.util.Objects::nonNull)
        .toList();

    return ResponseEntity.ok(notifications);
  }

  @PostMapping("/{notificationId}/read")
  public ResponseEntity<Void> markAsRead(
      @PathVariable String notificationId,
      @RequestParam String userId,
      @RequestAttribute(required = false) UserContext userContext) {

    // RBAC: Users can only mark their own notifications as read
    if (userContext != null && rbacEnforcer != null && !userContext.isAdmin()) {
      if (!userId.equals(userContext.getUserId())) {
        throw new RBACEnforcer.AccessDeniedException("You can only mark your own notifications as read");
      }
    }

    String key = "notifications:" + userId + ":" + notificationId;
    InAppNotification notification = (InAppNotification) redisTemplate.opsForValue().get(key);

    if (notification != null) {
      notification.setRead(true);
      notification.setReadAt(Instant.now());
      redisTemplate.opsForValue().set(key, notification);
      log.info("Notification marked as read: {}", notificationId);
    }

    return ResponseEntity.ok().build();
  }

  @PostMapping("/mark-as-read")
  public ResponseEntity<Void> markMultipleAsRead(
      @RequestBody MarkAsReadRequest request,
      @RequestAttribute(required = false) UserContext userContext) {

    if (userContext == null || userContext.getUserId() == null) {
      return ResponseEntity.badRequest().build();
    }

    String userId = userContext.getUserId();
    for (String notificationId : request.notificationIds()) {
      String key = "notifications:" + userId + ":" + notificationId;
      InAppNotification notification = (InAppNotification) redisTemplate.opsForValue().get(key);

      if (notification != null) {
        notification.setRead(true);
        notification.setReadAt(Instant.now());
        redisTemplate.opsForValue().set(key, notification);
      }
    }
    log.info("Marked {} notifications as read for user {}", request.notificationIds().size(), userId);
    return ResponseEntity.ok().build();
  }
}
