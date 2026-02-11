package com.lms.content.service;

import com.lms.content.domain.ContentItem;
import com.lms.content.domain.ContentMetadata;
import com.lms.content.domain.ContentStatus;
import com.lms.content.dto.event.ContentEvent;
import com.lms.content.repository.ContentItemRepository;
import com.lms.content.repository.ContentMetadataRepository;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContentProcessingService {

  private final ContentItemRepository contentItemRepository;
  private final ContentMetadataRepository contentMetadataRepository;
  private final MeterRegistry meterRegistry;

  @KafkaListener(topics = "content.events", groupId = "content-processing-group")
  @Transactional
  public void handleContentEvent(ContentEvent event) {
    long startTime = System.currentTimeMillis();
    log.info("Received content event: {} for item: {}", event.getEventType(), event.getContentItemId());

    try {
      if ("ContentUploadCompleted".equals(event.getEventType())) {
        processContent(event);
        meterRegistry.counter("media.processing.success", "type", event.getEventType()).increment();
      }
    } catch (Exception e) {
      log.error("Failed to process content {}: {}", event.getContentItemId(), e.getMessage(), e);
      meterRegistry
          .counter("media.processing.failure", "type", event.getEventType(), "error", e.getClass().getSimpleName())
          .increment();
      throw e;
    } finally {
      Timer.builder("media.processing.duration")
          .tag("type", event.getEventType())
          .register(meterRegistry)
          .record(System.currentTimeMillis() - startTime, TimeUnit.MILLISECONDS);
    }
  }

  private void processContent(ContentEvent event) {
    Optional<ContentItem> itemOpt = contentItemRepository.findById(event.getContentItemId());
    if (itemOpt.isEmpty()) {
      log.error("Content item not found: {}", event.getContentItemId());
      return;
    }

    ContentItem item = itemOpt.get();
    log.info("Processing content item: {} (Type: {})", item.getId(), item.getType());

    try {
      // Simulate processing (transcoding, metadata extraction, etc.)
      // In a real scenario, this might call an external service or use ffmpeg/etc.

      ContentMetadata metadata = item.getMetadata();
      if (metadata == null) {
        metadata = new ContentMetadata();
        metadata.setContentItem(item);
        metadata.setContentItemId(item.getId());
      }

      // Mocking metadata extraction
      if ("VIDEO".equals(item.getType().name())) {
        metadata.setDurationSecs(300); // 5 minutes mock
        metadata.setMimeType("video/mp4");
        metadata.setSizeBytes(1024L * 1024 * 50); // 50MB mock
        log.info("Extracted video metadata: {}s, {} bytes", metadata.getDurationSecs(), metadata.getSizeBytes());
      } else if ("PDF".equals(item.getType().name())) {
        metadata.setMimeType("application/pdf");
        metadata.setSizeBytes(1024L * 1024 * 5); // 5MB mock
        log.info("Extracted PDF metadata: {} bytes", metadata.getSizeBytes());
      }

      contentMetadataRepository.save(metadata);

      item.setStatus(ContentStatus.READY);
      contentItemRepository.save(item);

      log.info("Content processing completed successfully for item: {} and set status to READY", item.getId());
    } catch (Exception e) {
      log.error("Error processing content item {}: {}", item.getId(), e.getMessage());
      item.setStatus(ContentStatus.FAILED);
      contentItemRepository.save(item);
      throw e; // Rethrow to trigger retry or dead-letter queue
    }
  }
}
