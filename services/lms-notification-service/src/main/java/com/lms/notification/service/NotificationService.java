package com.lms.notification.service;

import com.lms.notification.event.DomainEvent;
import com.lms.notification.model.InAppNotification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
public class NotificationService {

  @Autowired(required = false)
  private JavaMailSender mailSender;

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @Async
  public void handleDomainEvent(DomainEvent event) {
    log.info("Processing event: {}", event.getEventType());

    switch (event.getEventType()) {
      case "UserCreated":
        handleUserCreated(event);
        break;
      case "EnrollmentCreated":
        handleEnrollmentCreated(event);
        break;
      case "AssignmentSubmitted":
        handleAssignmentSubmitted(event);
        break;
      case "PaymentCompleted":
        handlePaymentCompleted(event);
        break;
      default:
        log.debug("No notification handler for event: {}", event.getEventType());
    }
  }

  private void handleUserCreated(DomainEvent event) {
    String email = (String) event.getPayload().get("email");
    String name = (String) event.getPayload().get("name");
    String userId = event.getAggregateId();

    String message = String.format("Welcome %s! Your account has been created.", name);
    sendEmail(email, "Welcome to LMS", message);
    storeInAppNotification(userId, "USER_WELCOME", "Welcome", message);
  }

  private void handleEnrollmentCreated(DomainEvent event) {
    String userId = String.valueOf(event.getPayload().get("userId"));
    String courseName = (String) event.getPayload().get("courseName");

    String message = String.format("You have been enrolled in %s", courseName);
    storeInAppNotification(userId, "ENROLLMENT", "Course Enrollment", message);
  }

  private void handleAssignmentSubmitted(DomainEvent event) {
    String instructorId = String.valueOf(event.getPayload().get("instructorId"));
    String assignmentName = (String) event.getPayload().get("assignmentName");
    String studentName = (String) event.getPayload().get("studentName");

    String message = String.format("%s submitted assignment: %s", studentName, assignmentName);
    storeInAppNotification(instructorId, "ASSIGNMENT_SUBMISSION", "New Submission", message);
  }

  private void handlePaymentCompleted(DomainEvent event) {
    String userId = String.valueOf(event.getPayload().get("userId"));
    Double amount = (Double) event.getPayload().get("amount");

    String message = String.format("Payment of $%.2f completed successfully", amount);
    storeInAppNotification(userId, "PAYMENT", "Payment Confirmation", message);
  }

  private void sendEmail(String to, String subject, String text) {
    if (mailSender == null) {
      log.info("Email (mock): TO={}, SUBJECT={}, TEXT={}", to, subject, text);
      return;
    }

    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(to);
      message.setSubject(subject);
      message.setText(text);
      message.setFrom("noreply@lms.com");
      mailSender.send(message);
      log.info("Email sent to: {}", to);
    } catch (Exception e) {
      log.error("Failed to send email to: {}", to, e);
    }
  }

  private void storeInAppNotification(String userId, String type, String title, String message) {
    InAppNotification notification = InAppNotification.builder()
        .id(UUID.randomUUID().toString())
        .userId(userId)
        .type(type)
        .title(title)
        .message(message)
        .read(false)
        .createdAt(Instant.now())
        .build();

    String key = "notifications:" + userId + ":" + notification.getId();
    redisTemplate.opsForValue().set(key, notification);

    String userKey = "notifications:" + userId;
    redisTemplate.opsForSet().add(userKey, notification.getId());

    log.info("Notification stored for user: {}", userId);
  }

  public void markAsRead(String userId, String notificationId) {
    String key = "notifications:" + userId + ":" + notificationId;
    InAppNotification notification = (InAppNotification) redisTemplate.opsForValue().get(key);
    if (notification != null) {
      notification.setRead(true);
      notification.setReadAt(Instant.now());
      redisTemplate.opsForValue().set(key, notification);
      log.debug("Notification {} marked as read for user {}", notificationId, userId);
    }
  }
}
