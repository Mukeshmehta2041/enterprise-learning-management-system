package com.lms.content.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "content_renditions", schema = "lms_content")
@Getter
@Setter
@NoArgsConstructor
public class ContentRendition {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "content_version_id", nullable = false)
  private ContentVersion contentVersion;

  @Column(nullable = false)
  private String quality; // e.g., "720p", "480p", "original"

  @Column(nullable = false)
  private String storagePath;

  @Column
  private Integer width;

  @Column
  private Integer height;

  @Column
  private Long sizeBytes;

  public ContentRendition(UUID id, ContentVersion contentVersion, String quality, String storagePath) {
    this.id = id;
    this.contentVersion = contentVersion;
    this.quality = quality;
    this.storagePath = storagePath;
  }

  public String getResolution() {
    if (width == null || height == null) {
      return null;
    }
    return width + "x" + height;
  }

  public Integer getBitrate() {
    return null;
  }
}
