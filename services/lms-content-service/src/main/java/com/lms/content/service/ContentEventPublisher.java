package com.lms.content.service;

import com.lms.content.domain.ContentItem;
import com.lms.content.dto.event.ContentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

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

    sendAfterCommit(contentItem.getId().toString(), event);
  }

  public void publishContentUploadCompleted(ContentItem contentItem, String storagePath) {
    ContentEvent event = ContentEvent.builder()
        .eventId(UUID.randomUUID())
        .eventType("ContentUploadCompleted")
        .contentItemId(contentItem.getId())
        .courseId(contentItem.getCourseId())
        .title(contentItem.getTitle())
        .contentType(contentItem.getType().name())
        .storagePath(storagePath)
        .timestamp(OffsetDateTime.now())
        .build();

    sendAfterCommit(contentItem.getId().toString(), event);
  }

  private void sendAfterCommit(String key, ContentEvent event) {
    if (TransactionSynchronizationManager.isActualTransactionActive()) {
      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
        @Override
        public void afterCommit() {
          kafkaTemplate.send(TOPIC, key, event);
          log.info("Published {} event for content item: {} after commit", event.getEventType(), key);
        }
      });
    } else {
      kafkaTemplate.send(TOPIC, key, event);
      log.info("Published {} event for content item: {} (no transaction active)", event.getEventType(), key);
    }
  }
}
