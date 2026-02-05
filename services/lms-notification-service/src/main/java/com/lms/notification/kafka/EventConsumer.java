package com.lms.notification.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.notification.event.DomainEvent;
import com.lms.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EventConsumer {

  @Autowired
  private NotificationService notificationService;

  private final ObjectMapper objectMapper = new ObjectMapper();

  @KafkaListener(topics = {
      "user.events",
      "enrollment.events",
      "assignment.events",
      "payment.events",
      "course.events"
  }, groupId = "notification-service")
  public void consume(String message) {
    try {
      log.debug("Received message: {}", message);
      DomainEvent event = objectMapper.readValue(message, DomainEvent.class);
      notificationService.handleDomainEvent(event);
    } catch (Exception e) {
      log.error("Error processing message: {}", message, e);
    }
  }
}
