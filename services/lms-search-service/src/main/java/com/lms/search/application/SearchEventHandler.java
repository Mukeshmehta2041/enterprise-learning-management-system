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
        
        if ("CourseCreated".equals(event.eventType()) || "CourseUpdated".equals(event.eventType())) {
            Map<String, Object> payload = (Map<String, Object>) event.payload();
            CourseIndex courseIndex = CourseIndex.builder()
                    .id(payload.get("id").toString())
                    .title(payload.get("title").toString())
                    .description(payload.get("description").toString())
                    .status(payload.get("status").toString())
                    .slug(payload.get("slug").toString())
                    .build();
            courseSearchRepository.save(courseIndex);
            log.info("Indexed course: {}", courseIndex.getId());
        } else if ("CourseDeleted".equals(event.eventType())) {
            courseSearchRepository.deleteById(event.aggregateId());
            log.info("Deleted course from index: {}", event.aggregateId());
        }
    }
}
