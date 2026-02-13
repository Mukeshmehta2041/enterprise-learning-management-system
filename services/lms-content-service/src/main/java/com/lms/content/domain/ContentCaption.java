package com.lms.content.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "content_captions", schema = "lms_content")
@Getter
@Setter
@NoArgsConstructor
public class ContentCaption {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "content_item_id", nullable = false)
  private ContentItem contentItem;

  @Column(nullable = false)
  private String languageCode; // e.g., "en", "es"

  @Column(nullable = false)
  private String label; // e.g., "English", "Spanish"

  @Column(nullable = false)
  private String storagePath;

  public ContentCaption(UUID id, ContentItem contentItem, String languageCode, String label, String storagePath) {
    this.id = id;
    this.contentItem = contentItem;
    this.languageCode = languageCode;
    this.label = label;
    this.storagePath = storagePath;
  }
}
