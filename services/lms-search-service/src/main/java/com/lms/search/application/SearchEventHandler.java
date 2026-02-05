package com.lms.search.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.common.events.EventEnvelope;
import com.lms.search.domain.CourseIndex;
import com.lms.search.infrastructure.CourseSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchEventHandler {

  private final CourseSearchRepository courseSearchRepository;
  private final ObjectMapper objectMapper;

  @KafkaListener(topics = "course.events", groupId = "search-service-group")
  public void handleCourseEvent(EventEnvelope event) {
    log.info("Received course event: {} - {}", event.eventType(), event.aggregateId());

    try {
      if ("CourseCreated".equals(event.eventType()) || "CourseUpdated".equals(event.eventType())) {
        Map<String, Object> payload = (Map<String, Object>) event.payload();
        CourseIndex courseIndex = CourseIndex.builder()
            .id(getStringValue(payload, "id"))
            .title(getStringValue(payload, "title"))
            .description(getStringValue(payload, "description"))
            .status(getStringValue(payload, "status"))
            .slug(getStringValue(payload, "slug"))
            .instructorName(getStringValue(payload, "instructorName"))
            .category(getStringValue(payload, "category"))
            .price(getDoubleValue(payload, "price"))
            .build();
        courseSearchRepository.save(courseIndex);
        log.info("Indexed course: {}", courseIndex.getId());
      } else if ("CourseDeleted".equals(event.eventType())) {
        courseSearchRepository.deleteById(event.aggregateId());
        log.info("Deleted course from index: {}", event.aggregateId());
      }
    } catch (Exception e) {
      log.error("Error processing course event: {}", event.eventId(), e);
    }
  }

  private String getStringValue(Map<String, Object> payload, String key) {
    Object value = payload.get(key);
    return value != null ? value.toString() : null;
  }

  private Double getDoubleValue(Map<String, Object> payload, String key) {
    Object value = payload.get(key);
    if (value == null)
      return null;
    if (value instanceof Number)
      return ((Number) value).doubleValue();
    try {
      return Double.valueOf(value.toString());
    } catch (NumberFormatException e) {
      return null;
    }
  }
}
