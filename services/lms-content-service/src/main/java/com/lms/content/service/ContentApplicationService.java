package com.lms.content.service;

import com.lms.content.client.CourseServiceClient;
import com.lms.content.domain.*;
import com.lms.content.dto.PlaybackTokenResponse;
import com.lms.content.repository.ContentItemRepository;
import com.lms.content.repository.ContentVersionRepository;
import com.lms.content.repository.QuizQuestionRepository;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.exception.MediaErrorCode;
import com.lms.common.exception.MediaException;
import com.lms.common.exception.ResourceNotFoundException;
import com.lms.common.audit.AuditLogger;
import io.micrometer.observation.annotation.Observed;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j

@Service
@RequiredArgsConstructor
public class ContentApplicationService {
  private final ContentItemRepository contentItemRepository;
  private final ContentVersionRepository contentVersionRepository;
  private final QuizQuestionRepository quizQuestionRepository;
  private final ContentEventPublisher contentEventPublisher;
  private final CourseServiceClient courseServiceClient;
  private final AuditLogger auditLogger;
  private final MeterRegistry meterRegistry;
  private final StorageService storageService;

  @Transactional
  @Observed(name = "content.create")
  public ContentItem createContent(UUID courseId, UUID lessonId, ContentType type, String title, UUID userId,
      Set<String> roles) {
    log.info("Creating content: {} for course: {} by user: {}", title, courseId, userId);
    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(courseId, userId))) {
      throw new ForbiddenException("Not authorized to create content for this course");
    }

    ContentItem contentItem = new ContentItem(UUID.randomUUID(), courseId, lessonId, type, title, ContentStatus.DRAFT);
    ContentItem saved = contentItemRepository.save(contentItem);

    contentEventPublisher.publishContentPublished(saved);
    auditLogger.logSuccess("CONTENT_CREATE", "CONTENT", saved.getId().toString(), Map.of("courseId", courseId));

    return saved;
  }

  @Transactional
  @Observed(name = "content.addVersion")
  public ContentVersion addVersion(UUID contentItemId, Integer version, String storagePath, String checksum,
      UUID userId, Set<String> roles) {
    log.info("Adding version: {} to content item: {}", version, contentItemId);
    ContentItem contentItem = getById(contentItemId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to add content versions for this course");
    }

    ContentVersion contentVersion = new ContentVersion(UUID.randomUUID(), contentItem, version, storagePath, checksum);
    return contentVersionRepository.save(contentVersion);
  }

  @Transactional
  @Observed(name = "content.getUploadUrl")
  public URL getUploadUrl(UUID contentId, String fileName, String contentType, UUID userId, Set<String> roles) {
    log.info("Requesting upload URL for content: {} (Type: {})", contentId, contentType);
    ContentItem contentItem = getById(contentId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to upload content for this course");
    }

    // Basic content type validation
    if (contentType == null || (!contentType.startsWith("video/") && !contentType.equals("application/pdf"))) {
      throw new MediaException(MediaErrorCode.INVALID_FILE_TYPE, "Unsupported content type: " + contentType);
    }

    // Determine version number (latest + 1)
    int nextVersion = contentItem.getVersions().size() + 1;
    String storagePath = String.format("content/%s/%s/%s/v%d/%s",
        contentItem.getCourseId(), contentItem.getLessonId(), contentItem.getId(), nextVersion, fileName);

    try {
      URL uploadUrl = storageService.generatePresignedUploadUrl(storagePath, contentType, Duration.ofMinutes(15));

      contentItem.setStatus(ContentStatus.UPLOADING);
      contentItemRepository.save(contentItem);

      meterRegistry.counter("media.upload.initiated", "type", contentType).increment();

      return uploadUrl;
    } catch (Exception e) {
      log.error("Failed to generate presigned URL for content {}: {}", contentId, e.getMessage());
      throw new MediaException(MediaErrorCode.STORAGE_UNAVAILABLE, "Could not initiate upload", e);
    }
  }

  @Transactional
  @Observed(name = "content.completeUpload")
  public void completeUpload(UUID contentId, String storagePath, UUID userId, Set<String> roles) {
    log.info("Completing upload for content: {} with storage path: {}", contentId, storagePath);
    ContentItem contentItem = getById(contentId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to complete upload for this course");
    }

    contentItem.setStatus(ContentStatus.PROCESSING);
    contentItemRepository.save(contentItem);

    // Create the version record
    int versionNum = contentItem.getVersions().size() + 1;
    ContentVersion version = new ContentVersion(UUID.randomUUID(), contentItem, versionNum, storagePath, null);
    contentVersionRepository.save(version);

    contentEventPublisher.publishContentUploadCompleted(contentItem, storagePath);
    meterRegistry.counter("media.upload.completed").increment();
    auditLogger.logSuccess("CONTENT_UPLOAD_COMPLETE", "CONTENT", contentId.toString(),
        Map.of("storagePath", storagePath));
  }

  @Transactional
  public QuizQuestion addQuizQuestion(UUID contentItemId, String text, Map<String, String> options, String correctId,
      Integer order, UUID userId, Set<String> roles) {
    ContentItem contentItem = getById(contentItemId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to add quiz questions for this course");
    }

    QuizQuestion question = new QuizQuestion(UUID.randomUUID(), contentItem, text, options, correctId, order);
    return quizQuestionRepository.save(question);
  }

  public List<ContentItem> getByCourse(UUID courseId) {
    return contentItemRepository.findByCourseId(courseId);
  }

  public List<ContentItem> getByLesson(UUID lessonId) {
    return contentItemRepository.findByLessonId(lessonId);
  }

  @Transactional
  public void addQuizQuestions(UUID contentItemId, List<QuizQuestion> questions, UUID userId, Set<String> roles) {
    ContentItem contentItem = getById(contentItemId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to manage quiz questions for this course");
    }

    if (contentItem.getType() != ContentType.QUIZ) {
      throw new IllegalArgumentException("Content item is not a quiz");
    }

    // Clear existing questions if anyway
    contentItem.getQuestions().clear();
    for (QuizQuestion q : questions) {
      if (q.getId() == null)
        q.setId(UUID.randomUUID());
      q.setContentItem(contentItem);
      contentItem.getQuestions().add(q);
    }
    contentItemRepository.save(contentItem);
    auditLogger.logSuccess("QUIZ_UPDATE", "CONTENT", contentItemId.toString());
  }

  public ContentItem getById(UUID id) {
    return contentItemRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + id));
  }

  @Transactional(readOnly = true)
  public PlaybackTokenResponse getPlaybackToken(UUID contentItemId, UUID userId, Set<String> roles) {
    ContentItem contentItem = getById(contentItemId);

    boolean isInstructorOrAdmin = roles.contains("ADMIN")
        || (roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId));
    boolean isEnrolled = courseServiceClient.isUserEnrolled(contentItem.getCourseId(), userId);
    boolean isPreview = courseServiceClient.isLessonPreview(contentItem.getCourseId(), contentItem.getLessonId());
    boolean isFree = courseServiceClient.isCourseFree(contentItem.getCourseId());

    boolean isAuthorized = isInstructorOrAdmin || isEnrolled || isPreview || isFree;

    if (!isAuthorized) {
      auditLogger.log(
          "PLAYBACK_TOKEN_DENIED",
          "CONTENT",
          contentItemId.toString(),
          "FAILURE",
          "Not enrolled, not a preview, and course not free",
          Map.of("userId", userId, "reason", "Not enrolled, not a preview, and course not free"));
      throw new ForbiddenException("Not authorized to access this content. Enrollment or purchase required.");
    }

    if (!isInstructorOrAdmin && !courseServiceClient.isCoursePublished(contentItem.getCourseId())) {
      auditLogger.log(
          "PLAYBACK_TOKEN_DENIED",
          "CONTENT",
          contentItemId.toString(),
          "FAILURE",
          "Course not published",
          Map.of("userId", userId, "reason", "Course not published"));
      throw new ForbiddenException("This course is currently not available.");
    }

    if (isInstructorOrAdmin && !isEnrolled && !isPreview) {
      auditLogger.logSuccess("ADMIN_OVERRIDE", "CONTENT", contentItemId.toString(),
          Map.of("userId", userId, "courseId", contentItem.getCourseId(), "lessonId", contentItem.getLessonId()));
    }

    // In a real implementation, we would generate a signed URL or a JWT token for
    // the player
    // For now, we use the storage service to generate a short-lived download URL
    ContentVersion latestVersion = contentItem.getVersions().stream()
        .max((v1, v2) -> v1.getVersion().compareTo(v2.getVersion()))
        .orElseThrow(() -> new ResourceNotFoundException("No media versions available for this content"));

    URL playbackUrl = storageService.generatePresignedDownloadUrl(latestVersion.getStoragePath(), Duration.ofHours(1));

    List<PlaybackTokenResponse.CaptionDTO> captionDTOs = contentItem.getCaptions().stream()
        .map(c -> PlaybackTokenResponse.CaptionDTO.builder()
            .languageCode(c.getLanguageCode())
            .label(c.getLabel())
            .url(storageService.generatePresignedDownloadUrl(c.getStoragePath(), Duration.ofHours(1)).toString())
            .build())
        .collect(Collectors.toList());

    List<PlaybackTokenResponse.RenditionDTO> renditionDTOs = latestVersion.getRenditions().stream()
        .map(r -> PlaybackTokenResponse.RenditionDTO.builder()
            .resolution(r.getResolution())
            .bitrate(r.getBitrate())
            .url(storageService.generatePresignedDownloadUrl(r.getStoragePath(), Duration.ofHours(1)).toString())
            .build())
        .collect(Collectors.toList());

    auditLogger.logSuccess("PLAYBACK_TOKEN_ISSUED", "CONTENT", contentItemId.toString(),
        Map.of("userId", userId));

    return PlaybackTokenResponse.builder()
        .playbackUrl(playbackUrl.toString())
        .token(UUID.randomUUID().toString()) // Mock token
        .expiresAt(LocalDateTime.now().plusHours(1))
        .captions(captionDTOs)
        .renditions(renditionDTOs)
        .build();
  }
}
