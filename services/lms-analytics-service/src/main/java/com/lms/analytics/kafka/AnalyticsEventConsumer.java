package com.lms.analytics.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.analytics.model.EventSnapshot;
import com.lms.analytics.repository.EventSnapshotRepository;
import com.lms.analytics.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
@Service
public class AnalyticsEventConsumer {

  @Autowired
  private EventSnapshotRepository eventSnapshotRepository;

  @Autowired
  private AnalyticsService analyticsService;

  private final ObjectMapper objectMapper = new ObjectMapper();

  @KafkaListener(topics = {
      "user.events",
      "enrollment.events",
      "assignment.events",
      "payment.events",
      "course.events"
  }, groupId = "analytics-service")
  public void consume(String message) {
    try {
      log.debug("Received message: {}", message);
      Map<String, Object> event = objectMapper.readValue(message, Map.class);

      String eventType = (String) event.get("eventType");
      EventSnapshot snapshot = EventSnapshot.builder()
          .eventType(eventType)
          .payload(message)
          .date(LocalDate.now())
          .build();
      eventSnapshotRepository.save(snapshot);

      // Handle specific event types for aggregation
      analyticsService.handleEvent(event);

      log.info("Event stored and aggregated: {}", eventType);
    } catch (Exception e) {
      log.error("Error processing message: {}", message, e);
    }
  }
}
