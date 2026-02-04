package com.lms.content.service;

import com.lms.content.domain.ContentItem;
import com.lms.content.domain.ContentType;
import com.lms.content.domain.ContentVersion;
import com.lms.content.domain.QuizQuestion;
import com.lms.content.repository.ContentItemRepository;
import com.lms.content.repository.ContentVersionRepository;
import com.lms.content.repository.QuizQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContentApplicationService {
    private final ContentItemRepository contentItemRepository;
    private final ContentVersionRepository contentVersionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final ContentEventPublisher contentEventPublisher;

    @Transactional
    public ContentItem createContent(UUID courseId, UUID lessonId, ContentType type, String title) {
        ContentItem contentItem = new ContentItem(UUID.randomUUID(), courseId, lessonId, type, title);
        ContentItem saved = contentItemRepository.save(contentItem);
        
        contentEventPublisher.publishContentPublished(saved);
        
        return saved;
    }

    @Transactional
    public ContentVersion addVersion(UUID contentItemId, Integer version, String storagePath, String checksum) {
        ContentItem contentItem = getById(contentItemId);
        ContentVersion contentVersion = new ContentVersion(UUID.randomUUID(), contentItem, version, storagePath, checksum);
        return contentVersionRepository.save(contentVersion);
    }

    @Transactional
    public QuizQuestion addQuizQuestion(UUID contentItemId, String text, Map<String, String> options, String correctId, Integer order) {
        ContentItem contentItem = getById(contentItemId);
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
