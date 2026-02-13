package com.lms.content.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "content_metadata", schema = "lms_content")
@Getter
@Setter
@NoArgsConstructor
public class ContentMetadata {
  @Id
  @Column(name = "content_item_id")
  private UUID contentItemId;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  @JoinColumn(name = "content_item_id")
  private ContentItem contentItem;

  @Column(name = "duration_secs")
  private Integer durationSecs;

  @Column(name = "size_bytes")
  private Long sizeBytes;

  @Column(name = "mime_type", length = 100)
  private String mimeType;

  public ContentMetadata(ContentItem contentItem, Integer durationSecs, Long sizeBytes, String mimeType) {
    this.contentItem = contentItem;
    this.contentItemId = contentItem.getId();
    this.durationSecs = durationSecs;
    this.sizeBytes = sizeBytes;
    this.mimeType = mimeType;
  }

  public void setContentItem(ContentItem contentItem) {
    this.contentItem = contentItem;
  }

  public void setContentItemId(UUID contentItemId) {
    this.contentItemId = contentItemId;
  }

  public Integer getDurationSecs() {
    return durationSecs;
  }

  public void setDurationSecs(Integer durationSecs) {
    this.durationSecs = durationSecs;
  }

  public Long getSizeBytes() {
    return sizeBytes;
  }

  public void setSizeBytes(Long sizeBytes) {
    this.sizeBytes = sizeBytes;
  }

  public void setMimeType(String mimeType) {
    this.mimeType = mimeType;
  }
}
