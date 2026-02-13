package com.lms.content.service;

import com.lms.content.domain.ContentItem;
import com.lms.content.domain.ContentMetadata;
import com.lms.content.domain.ContentStatus;
import com.lms.content.domain.ContentType;
import com.lms.content.domain.ContentVersion;
import com.lms.content.domain.ContentRendition;
import com.lms.content.dto.event.ContentEvent;
import com.lms.content.repository.ContentItemRepository;
import com.lms.content.repository.ContentMetadataRepository;
import com.lms.content.repository.ContentRenditionRepository;
import com.lms.common.exception.MediaErrorCode;
import com.lms.common.exception.MediaException;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ContentProcessingService {

  private static final Logger log = LoggerFactory.getLogger(ContentProcessingService.class);

  private final ContentItemRepository contentItemRepository;
  private final ContentMetadataRepository contentMetadataRepository;
  private final ContentRenditionRepository contentRenditionRepository;
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
      if (item.getType() == ContentType.VIDEO) {
        metadata.setDurationSecs(300); // 5 minutes mock
        metadata.setMimeType("video/mp4");
        metadata.setSizeBytes(1024L * 1024 * 50); // 50MB mock
        log.info("Extracted video metadata: {}s, {} bytes", metadata.getDurationSecs(), metadata.getSizeBytes());

        // Simulate multi-rendition generation (Day 8 task)
        ContentVersion latestVersion = item.getVersions().stream()
            .max((v1, v2) -> v1.getVersion().compareTo(v2.getVersion()))
            .orElseThrow(() -> new IllegalStateException("No version found just after upload complete"));

        createRendition(latestVersion, "720p", "video/720p.mp4", 1280, 720, 1024L * 1024 * 30);
        createRendition(latestVersion, "480p", "video/480p.mp4", 854, 480, 1024L * 1024 * 15);
        createRendition(latestVersion, "original", latestVersion.getStoragePath(), 1920, 1080, 1024L * 1024 * 50);
        createThumbnail(latestVersion, "thumbnails/" + item.getId() + "/v" + latestVersion.getVersion() + "/thumb.jpg");
      } else if (item.getType() == ContentType.PDF) {
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
      throw new MediaException(MediaErrorCode.PROCESSING_FAILED, "Processing failed for item: " + item.getId(), e);
    }
  }

  private void createRendition(ContentVersion version, String quality, String path, int width, int height, long size) {
    ContentRendition rendition = new ContentRendition(UUID.randomUUID(), version, quality, path);
    rendition.setWidth(width);
    rendition.setHeight(height);
    rendition.setSizeBytes(size);
    contentRenditionRepository.save(rendition);
    log.info("Created rendition: {} for version: {}", quality, version.getId());
  }

  private void createThumbnail(ContentVersion version, String path) {
    ContentRendition thumbnail = new ContentRendition(UUID.randomUUID(), version, "thumbnail", path);
    thumbnail.setWidth(640);
    thumbnail.setHeight(360);
    thumbnail.setSizeBytes(1024L * 50);
    contentRenditionRepository.save(thumbnail);
    log.info("Created thumbnail for version: {}", version.getId());
  }
}
