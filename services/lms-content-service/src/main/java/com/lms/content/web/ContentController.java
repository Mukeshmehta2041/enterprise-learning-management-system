package com.lms.content.web;

import com.lms.content.domain.ContentItem;
import com.lms.content.domain.ContentType;
import com.lms.content.domain.ContentVersion;
import com.lms.content.domain.QuizQuestion;
import com.lms.content.service.ContentApplicationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {
    private final ContentApplicationService contentApplicationService;

    @PostMapping
    public ResponseEntity<ContentItem> createContent(@RequestBody CreateContentRequest request) {
        ContentItem content = contentApplicationService.createContent(
                request.getCourseId(),
                request.getLessonId(),
                request.getType(),
                request.getTitle()
        );
        return ResponseEntity.ok(content);
    }

    @PostMapping("/{contentItemId}/versions")
    public ResponseEntity<ContentVersion> addVersion(@PathVariable UUID contentItemId, @RequestBody AddVersionRequest request) {
        ContentVersion version = contentApplicationService.addVersion(
                contentItemId,
                request.getVersion(),
                request.getStoragePath(),
                request.getChecksum()
        );
        return ResponseEntity.ok(version);
    }

    @PostMapping("/{contentItemId}/questions")
    public ResponseEntity<QuizQuestion> addQuizQuestion(@PathVariable UUID contentItemId, @RequestBody AddQuizQuestionRequest request) {
        QuizQuestion question = contentApplicationService.addQuizQuestion(
                contentItemId,
                request.getQuestionText(),
                request.getOptions(),
                request.getCorrectOptionId(),
                request.getSortOrder()
        );
        return ResponseEntity.ok(question);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ContentItem>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(contentApplicationService.getByCourse(courseId));
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<ContentItem>> getByLesson(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(contentApplicationService.getByLesson(lessonId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentItem> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(contentApplicationService.getById(id));
    }

    @Data
    public static class CreateContentRequest {
        private UUID courseId;
        private UUID lessonId;
        private ContentType type;
        private String title;
    }

    @Data
    public static class AddVersionRequest {
        private Integer version;
        private String storagePath;
        private String checksum;
    }

    @Data
    public static class AddQuizQuestionRequest {
        private String questionText;
        private Map<String, String> options;
        private String correctOptionId;
        private Integer sortOrder;
    }
}
