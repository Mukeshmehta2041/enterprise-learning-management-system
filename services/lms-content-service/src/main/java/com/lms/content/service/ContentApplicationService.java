package com.lms.content.service;

import com.lms.content.client.CourseServiceClient;
import com.lms.content.domain.*;
import com.lms.content.dto.PlaybackTokenResponse;
import com.lms.content.repository.ContentItemRepository;
import com.lms.content.repository.ContentVersionRepository;
import com.lms.content.repository.QuizQuestionRepository;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.exception.ResourceNotFoundException;
import com.lms.common.audit.AuditLogger;
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class ContentApplicationService {
  private final ContentItemRepository contentItemRepository;
  private final ContentVersionRepository contentVersionRepository;
  private final QuizQuestionRepository quizQuestionRepository;
  private final ContentEventPublisher contentEventPublisher;
  private final CourseServiceClient courseServiceClient;
  private final AuditLogger auditLogger;
  private final StorageService storageService;

  @Transactional
  public ContentItem createContent(UUID courseId, UUID lessonId, ContentType type, String title, UUID userId,
      Set<String> roles) {
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
  public ContentVersion addVersion(UUID contentItemId, Integer version, String storagePath, String checksum,
      UUID userId, Set<String> roles) {
    ContentItem contentItem = getById(contentItemId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to add content versions for this course");
    }

    ContentVersion contentVersion = new ContentVersion(UUID.randomUUID(), contentItem, version, storagePath, checksum);
    return contentVersionRepository.save(contentVersion);
  }

  @Transactional
  public URL getUploadUrl(UUID contentId, String fileName, String contentType, UUID userId, Set<String> roles) {
    ContentItem contentItem = getById(contentId);

    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))) {
      throw new ForbiddenException("Not authorized to upload content for this course");
    }

    // Determine version number (latest + 1)
    int nextVersion = contentItem.getVersions().size() + 1;
    String storagePath = String.format("content/%s/%s/%s/v%d/%s",
        contentItem.getCourseId(), contentItem.getLessonId(), contentItem.getId(), nextVersion, fileName);

    URL uploadUrl = storageService.generatePresignedUploadUrl(storagePath, contentType, Duration.ofMinutes(15));

    contentItem.setStatus(ContentStatus.UPLOADING);
    contentItemRepository.save(contentItem);

    // We don't save the version yet as it's not actually uploaded
    // But we might want to store the intended storage path temporarily or let the
    // client provide it in completeUpload

    return uploadUrl;
  }

  @Transactional
  public void completeUpload(UUID contentId, String storagePath, UUID userId, Set<String> roles) {
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

  public ContentItem getById(UUID id) {
    return contentItemRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + id));
  }

  @Transactional(readOnly = true)
  public PlaybackTokenResponse getPlaybackToken(UUID contentItemId, UUID userId, Set<String> roles) {
    ContentItem contentItem = getById(contentItemId);

    boolean isAuthorized = roles.contains("ADMIN")
        || (roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(contentItem.getCourseId(), userId))
        || courseServiceClient.isUserEnrolled(contentItem.getCourseId(), userId);

    if (!isAuthorized) {
      throw new ForbiddenException("Not authorized to access this content. Enrollment required.");
    }

    // In a real implementation, we would generate a signed URL or a JWT token for the player
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

    return PlaybackTokenResponse.builder()
        .playbackUrl(playbackUrl.toString())
        .token(UUID.randomUUID().toString()) // Mock token
        .expiresAt(LocalDateTime.now().plusHours(1))
        .captions(captionDTOs)
        .build();
  }
}
