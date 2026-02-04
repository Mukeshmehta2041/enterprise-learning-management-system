package com.lms.content.service;

import com.lms.content.domain.ContentItem;
import com.lms.content.dto.event.ContentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentEventPublisher {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "content.events";

    public void publishContentPublished(ContentItem contentItem) {
        ContentEvent event = ContentEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("ContentPublished")
                .contentItemId(contentItem.getId())
                .courseId(contentItem.getCourseId())
                .title(contentItem.getTitle())
                .contentType(contentItem.getType().name())
                .timestamp(OffsetDateTime.now())
                .build();

        kafkaTemplate.send(TOPIC, contentItem.getId().toString(), event);
        log.info("Published ContentPublished event for content item: {}", contentItem.getId());
    }
}
