package com.lms.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class NotificationService {

  @Autowired(required = false)
  private JavaMailSender mailSender;

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private NotificationStreamService streamService;

  @Autowired
  private com.lms.notification.client.EnrollmentServiceClient enrollmentServiceClient;

  @Autowired
  private com.lms.notification.client.UserServiceClient userServiceClient;

  @Autowired
  private NotificationPreferenceService preferenceService;

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
      case "SubmissionReceived":
        handleAssignmentSubmitted(event);
        break;
      case "AssignmentGraded":
        handleAssignmentGraded(event);
        break;
      case "AssignmentCreated":
        handleAssignmentCreated(event);
        break;
      case "AssignmentDueSoon":
        handleAssignmentDueSoon(event);
        break;
      case "AssignmentUpdated":
        handleAssignmentUpdated(event);
        break;
      case "LessonPublished":
        handleLessonPublished(event);
        break;
      case "LessonUpdated":
        handleLessonUpdated(event);
        break;
      case "PaymentCompleted":
        handlePaymentCompleted(event);
        break;
      case "USER_DELETED":
        handleUserDeletedEvent(event);
        break;
      default:
        log.debug("No notification handler for event: {}", event.getEventType());
    }
  }

  private void handleAssignmentGraded(DomainEvent event) {
    String userId = String.valueOf(event.getPayload().get("studentId"));
    String assignmentTitle = (String) event.getPayload().get("assignmentTitle");
    Number score = (Number) event.getPayload().get("score");
    String assignmentId = String.valueOf(event.getPayload().get("assignmentId"));

    String message = String.format("Your submission for '%s' has been graded. Score: %s", assignmentTitle, score);
    String link = "/assignments/" + assignmentId;

    notifyUser(UUID.fromString(userId), null, "AssignmentGraded", "ASSIGNMENT_GRADED", "Assignment Graded", message,
        link);
  }

  private void handleAssignmentCreated(DomainEvent event) {
    UUID courseId = UUID.fromString(String.valueOf(event.getPayload().get("courseId")));
    String title = (String) event.getPayload().get("title");
    String assignmentId = (String) event.getAggregateId();

    List<UUID> userIds = enrollmentServiceClient.getEnrolledUserIds(courseId);
    String message = String.format("New assignment posted: %s", title);
    String link = "/assignments/" + assignmentId;

    for (UUID userId : userIds) {
      notifyUser(userId, courseId, "AssignmentCreated", "ASSIGNMENT_CREATED", "New Assignment", message, link);
    }
  }

  private void handleAssignmentUpdated(DomainEvent event) {
    UUID courseId = UUID.fromString(String.valueOf(event.getPayload().get("courseId")));
    String title = (String) event.getPayload().get("title");
    String assignmentId = (String) event.getAggregateId();

    List<UUID> userIds = enrollmentServiceClient.getEnrolledUserIds(courseId);
    String message = String.format("Update: Assignment '%s' details have been updated.", title);
    String link = "/assignments/" + assignmentId;

    for (UUID userId : userIds) {
      notifyUser(userId, courseId, "AssignmentUpdated", "ASSIGNMENT_UPDATED", "Assignment Update", message, link);
    }
  }

  private void handleAssignmentDueSoon(DomainEvent event) {
    UUID courseId = UUID.fromString(String.valueOf(event.getPayload().get("courseId")));
    String title = (String) event.getPayload().get("title");
    String assignmentId = (String) event.getAggregateId();

    List<UUID> userIds = enrollmentServiceClient.getEnrolledUserIds(courseId);
    String message = String.format("Reminder: Assignment '%s' is due in 24 hours.", title);
    String link = "/assignments/" + assignmentId;

    for (UUID userId : userIds) {
      notifyUser(userId, courseId, "AssignmentDueSoon", "ASSIGNMENT_DUE_SOON", "Deadline Approaching", message, link);
    }
  }

  private void handleLessonPublished(DomainEvent event) {
    UUID courseId = UUID.fromString(String.valueOf(event.getPayload().get("courseId")));
    String title = (String) event.getPayload().get("title");
    String lessonId = (String) event.getAggregateId();

    List<UUID> userIds = enrollmentServiceClient.getEnrolledUserIds(courseId);
    String message = String.format("New lesson available: %s", title);
    String link = "/courses/" + courseId + "/lesson/" + lessonId;

    for (UUID userId : userIds) {
      notifyUser(userId, courseId, "LessonPublished", "LESSON_PUBLISHED", "New Lesson", message, link);
    }
  }

  private void handleLessonUpdated(DomainEvent event) {
    UUID courseId = UUID.fromString(String.valueOf(event.getPayload().get("courseId")));
    String title = (String) event.getPayload().get("title");
    String lessonId = (String) event.getAggregateId();

    List<UUID> userIds = enrollmentServiceClient.getEnrolledUserIds(courseId);
    String message = String.format("Lesson updated: %s", title);
    String link = "/courses/" + courseId + "/lesson/" + lessonId;

    for (UUID userId : userIds) {
      notifyUser(userId, courseId, "LessonUpdated", "LESSON_UPDATED", "Lesson Update", message, link);
    }
  }

  private void notifyUser(UUID userId, UUID courseId, String eventType, String category, String title, String message,
      String link) {
    // 1. In-App
    if (preferenceService.isEnabled(userId, courseId, eventType,
        com.lms.notification.model.NotificationPreference.NotificationChannel.IN_APP)) {
      storeInAppNotification(userId.toString(), category, title, message, link);
    }

    // 2. Email
    if (preferenceService.isEnabled(userId, courseId, eventType,
        com.lms.notification.model.NotificationPreference.NotificationChannel.EMAIL)) {
      // In a real app, you would get user email from user-service
      log.info("Sending email for event {} to user {}", eventType, userId);
    }

    // 3. Push
    if (preferenceService.isEnabled(userId, courseId, eventType,
        com.lms.notification.model.NotificationPreference.NotificationChannel.PUSH)) {
      sendPushNotification(userId.toString(), title, message, link);
    }
  }

  private void handleUserDeletedEvent(DomainEvent event) {
    String userId = event.getAggregateId();
    log.info("Cleaning up notifications for deleted user: {}", userId);

    String userKey = "notifications:" + userId;
    java.util.Set<Object> notificationIds = redisTemplate.opsForSet().members(userKey);

    if (notificationIds != null) {
      for (Object id : notificationIds) {
        redisTemplate.delete("notifications:" + userId + ":" + id);
      }
    }
    redisTemplate.delete(userKey);
    log.info("Successfully cleaned up notifications for user: {}", userId);
  }

  private void handleUserCreated(DomainEvent event) {
    String email = (String) event.getPayload().get("email");
    String name = (String) event.getPayload().get("name");
    String userId = event.getAggregateId();

    String message = String.format("Welcome %s! Your account has been created.", name);
    sendEmail(email, "Welcome to LMS", message);
    storeInAppNotification(userId, "USER_WELCOME", "Welcome", message, null);
  }

  private void handleEnrollmentCreated(DomainEvent event) {
    String userId = String.valueOf(event.getPayload().get("userId"));
    String courseName = (String) event.getPayload().get("courseName");

    String message = String.format("You have been enrolled in %s", courseName);
    storeInAppNotification(userId, "ENROLLMENT", "Course Enrollment", message, null);
  }

  private void handleAssignmentSubmitted(DomainEvent event) {
    String instructorId = String.valueOf(event.getPayload().get("instructorId"));
    String assignmentName = (String) event.getPayload().get("assignmentName");
    String studentName = (String) event.getPayload().get("studentName");

    String message = String.format("%s submitted assignment: %s", studentName, assignmentName);
    storeInAppNotification(instructorId, "ASSIGNMENT_SUBMISSION", "New Submission", message, null);
  }

  private void handlePaymentCompleted(DomainEvent event) {
    String userId = String.valueOf(event.getPayload().get("userId"));
    Double amount = (Double) event.getPayload().get("amount");

    String message = String.format("Payment of $%.2f completed successfully", amount);
    storeInAppNotification(userId, "PAYMENT", "Payment Confirmation", message, null);
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

  private void sendPushNotification(String userId, String title, String message, String link) {
    try {
      var response = userServiceClient.getPushToken(UUID.fromString(userId));
      if (response != null && response.token() != null) {
        log.info("Push notification (mock) TO={} [{}]: TITLE={}, MESSAGE={}, LINK={}",
            userId, response.platform(), title, message, link);
        // Here you would call Expo/FCM API
      }
    } catch (Exception e) {
      log.debug("No push token for user: {}", userId);
    }
  }

  private void storeInAppNotification(String userId, String type, String title, String message, String link) {
    InAppNotification notification = InAppNotification.builder()
        .id(UUID.randomUUID().toString())
        .userId(userId)
        .type(type)
        .title(title)
        .message(message)
        .link(link)
        .read(false)
        .createdAt(Instant.now())
        .build();

    String key = "notifications:" + userId + ":" + notification.getId();
    redisTemplate.opsForValue().set(key, notification);

    String userKey = "notifications:" + userId;
    redisTemplate.opsForSet().add(userKey, notification.getId());

    // Broadcast in real-time
    streamService.broadcast(userId, notification);

    log.info("Notification stored for user: {}", userId);
  }

  public void markAsRead(String userId, String notificationId) {
    String key = "notifications:" + userId + ":" + notificationId;
    Object raw = redisTemplate.opsForValue().get(key);
    if (raw != null) {
      InAppNotification notification = objectMapper.convertValue(raw, InAppNotification.class);
      notification.setRead(true);
      notification.setReadAt(Instant.now());
      redisTemplate.opsForValue().set(key, notification);
      log.debug("Notification {} marked as read for user {}", notificationId, userId);
    }
  }
}
