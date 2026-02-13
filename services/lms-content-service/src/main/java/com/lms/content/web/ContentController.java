package com.lms.content.web;

import com.lms.content.domain.*;
import com.lms.content.dto.ContentResponseDTO;
import com.lms.content.dto.PlaybackTokenResponse;
import com.lms.content.service.ContentApplicationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {
  private final ContentApplicationService contentApplicationService;

  private static final String HEADER_USER_ID = "X-User-Id";
  private static final String HEADER_ROLES = "X-Roles";

  @GetMapping("/{contentId}/playback-token")
  public ResponseEntity<PlaybackTokenResponse> getPlaybackToken(
      @PathVariable UUID contentId,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    PlaybackTokenResponse response = contentApplicationService.getPlaybackToken(contentId, userId, roles);
    return ResponseEntity.ok(response);
  }

  @PostMapping
  public ResponseEntity<ContentResponseDTO> createContent(
      @RequestBody CreateContentRequest request,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    ContentItem content = contentApplicationService.createContent(
        request.getCourseId(),
        request.getLessonId(),
        request.getType(),
        request.getTitle(),
        userId,
        roles);
    return ResponseEntity.ok(mapToDTO(content));
  }

  @PostMapping("/{contentId}/upload-url")
  public ResponseEntity<Map<String, String>> getUploadUrl(
      @PathVariable UUID contentId,
      @RequestBody UploadUrlRequest request,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    URL url = contentApplicationService.getUploadUrl(
        contentId,
        request.getFileName(),
        request.getContentType(),
        userId,
        roles);
    return ResponseEntity.ok(Map.of("uploadUrl", url.toString()));
  }

  @PostMapping("/{contentId}/complete-upload")
  public ResponseEntity<Void> completeUpload(
      @PathVariable UUID contentId,
      @RequestBody CompleteUploadRequest request,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    contentApplicationService.completeUpload(contentId, request.getStoragePath(), userId, roles);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{contentItemId}/versions")
  public ResponseEntity<ContentVersion> addVersion(
      @PathVariable UUID contentItemId,
      @RequestBody AddVersionRequest request,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    ContentVersion version = contentApplicationService.addVersion(
        contentItemId,
        request.getVersion(),
        request.getStoragePath(),
        request.getChecksum(),
        userId,
        roles);
    return ResponseEntity.ok(version);
  }

  @PostMapping("/{contentItemId}/questions")
  public ResponseEntity<QuizQuestion> addQuizQuestion(
      @PathVariable UUID contentItemId,
      @RequestBody AddQuizQuestionRequest request,
      @RequestHeader(HEADER_USER_ID) UUID userId,
      @RequestHeader(HEADER_ROLES) String rolesHeader) {
    Set<String> roles = parseRoles(rolesHeader);
    QuizQuestion question = contentApplicationService.addQuizQuestion(
        contentItemId,
        request.getQuestionText(),
        request.getOptions(),
        request.getCorrectOptionId(),
        request.getSortOrder(),
        userId,
        roles);
    return ResponseEntity.ok(question);
  }

  @GetMapping("/course/{courseId}")
  public ResponseEntity<List<ContentResponseDTO>> getByCourse(@PathVariable UUID courseId) {
    return ResponseEntity.ok(contentApplicationService.getByCourse(courseId).stream()
        .map(this::mapToDTO)
        .collect(Collectors.toList()));
  }

  @GetMapping("/lesson/{lessonId}")
  public ResponseEntity<List<ContentResponseDTO>> getByLesson(@PathVariable UUID lessonId) {
    return ResponseEntity.ok(contentApplicationService.getByLesson(lessonId).stream()
        .map(this::mapToDTO)
        .collect(Collectors.toList()));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContentResponseDTO> getById(@PathVariable UUID id) {
    return ResponseEntity.ok(mapToDTO(contentApplicationService.getById(id)));
  }

  private ContentResponseDTO mapToDTO(ContentItem item) {
    ContentResponseDTO.MetadataDTO metadataDTO = null;
    if (item.getMetadata() != null) {
      metadataDTO = ContentResponseDTO.MetadataDTO.builder()
          .durationSecs(item.getMetadata().getDurationSecs())
          .sizeBytes(item.getMetadata().getSizeBytes())
          .mimeType(item.getMetadata().getMimeType())
          .build();
    }

    List<ContentResponseDTO.QuizQuestionDTO> questions = null;
    if (item.getQuestions() != null && !item.getQuestions().isEmpty()) {
      questions = item.getQuestions().stream()
          .map(q -> ContentResponseDTO.QuizQuestionDTO.builder()
              .id(q.getId())
              .questionText(q.getQuestionText())
              .options(q.getOptions())
              .correctOptionId(q.getCorrectOptionId())
              .sortOrder(q.getSortOrder())
              .build())
          .collect(Collectors.toList());
    }

    return ContentResponseDTO.builder()
        .id(item.getId())
        .courseId(item.getCourseId())
        .lessonId(item.getLessonId())
        .type(item.getType())
        .title(item.getTitle())
        .status(item.getStatus())
        .metadata(metadataDTO)
        .questions(questions)
        .build();
  }

  private Set<String> parseRoles(String rolesHeader) {
    if (rolesHeader == null || rolesHeader.isBlank()) {
      return java.util.Collections.emptySet();
    }
    return java.util.Arrays.stream(rolesHeader.split(","))
        .map(String::trim)
        .collect(java.util.stream.Collectors.toSet());
  }

  @Data
  public static class CreateContentRequest {
    private UUID courseId;
    private UUID lessonId;
    private ContentType type;
    private String title;
  }

  @Data
  public static class UploadUrlRequest {
    private String fileName;
    private String contentType;
  }

  @Data
  public static class CompleteUploadRequest {
    private String storagePath;
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
