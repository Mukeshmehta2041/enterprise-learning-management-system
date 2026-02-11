package com.lms.content.dto;

import com.lms.content.domain.ContentStatus;
import com.lms.content.domain.ContentType;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ContentResponseDTO {
  private UUID id;
  private UUID courseId;
  private UUID lessonId;
  private ContentType type;
  private String title;
  private ContentStatus status;
  private MetadataDTO metadata;

  @Data
  @Builder
  public static class MetadataDTO {
    private Integer durationSecs;
    private Long sizeBytes;
    private String mimeType;
  }
}
