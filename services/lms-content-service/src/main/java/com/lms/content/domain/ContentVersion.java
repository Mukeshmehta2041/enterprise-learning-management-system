package com.lms.content.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "content_versions", schema = "lms_content")
@Getter
@Setter
@NoArgsConstructor
public class ContentVersion {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "content_item_id", nullable = false)
  private ContentItem contentItem;

  @Column(nullable = false)
  private Integer version;

  @Column(name = "storage_path", length = 1024)
  private String storagePath;

  @Column(length = 255)
  private String checksum;

  @OneToMany(mappedBy = "contentVersion", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ContentRendition> renditions = new ArrayList<>();

  @CreationTimestamp
  @Column(name = "published_at", updatable = false)
  private OffsetDateTime publishedAt;

  public ContentVersion(UUID id, ContentItem contentItem, Integer version, String storagePath, String checksum) {
    this.id = id;
    this.contentItem = contentItem;
    this.version = version;
    this.storagePath = storagePath;
    this.checksum = checksum;
  }

  public UUID getId() {
    return id;
  }

  public Integer getVersion() {
    return version;
  }

  public String getStoragePath() {
    return storagePath;
  }
}
