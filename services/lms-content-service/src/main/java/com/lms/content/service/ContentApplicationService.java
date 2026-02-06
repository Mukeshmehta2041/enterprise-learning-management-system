package com.lms.content.service;

import com.lms.content.client.CourseServiceClient;
import com.lms.content.domain.ContentItem;
import com.lms.content.domain.ContentType;
import com.lms.content.domain.ContentVersion;
import com.lms.content.domain.QuizQuestion;
import com.lms.content.repository.ContentItemRepository;
import com.lms.content.repository.ContentVersionRepository;
import com.lms.content.repository.QuizQuestionRepository;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.audit.AuditLogger;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContentApplicationService {
  private final ContentItemRepository contentItemRepository;
  private final ContentVersionRepository contentVersionRepository;
  private final QuizQuestionRepository quizQuestionRepository;
  private final ContentEventPublisher contentEventPublisher;
  private final CourseServiceClient courseServiceClient;
  private final AuditLogger auditLogger;

  @Transactional
  public ContentItem createContent(UUID courseId, UUID lessonId, ContentType type, String title, UUID userId,
      Set<String> roles) {
    if (!roles.contains("ADMIN")
        && !(roles.contains("INSTRUCTOR") && courseServiceClient.isUserInstructor(courseId, userId))) {
      throw new ForbiddenException("Not authorized to create content for this course");
    }

    ContentItem contentItem = new ContentItem(UUID.randomUUID(), courseId, lessonId, type, title);
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
        .orElseThrow(() -> new RuntimeException("Content not found: " + id));
  }
}
