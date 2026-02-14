package com.lms.content.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "content_items", schema = "lms_content")
@Getter
@Setter
@NoArgsConstructor
public class ContentItem {
  @Id
  private UUID id;

  @Column(name = "course_id", nullable = false)
  private UUID courseId;

  @Column(name = "lesson_id", nullable = true)
  private UUID lessonId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ContentType type;

  @Column(nullable = false)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ContentStatus status;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private OffsetDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @Version
  private Long version;

  @OneToMany(mappedBy = "contentItem", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ContentVersion> versions = new ArrayList<>();

  @OneToMany(mappedBy = "contentItem", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder ASC")
  private List<QuizQuestion> questions = new ArrayList<>();

  @OneToMany(mappedBy = "contentItem", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ContentCaption> captions = new ArrayList<>();

  @OneToOne(mappedBy = "contentItem", cascade = CascadeType.ALL, orphanRemoval = true)
  private ContentMetadata metadata;

  public ContentItem(UUID id, UUID courseId, UUID lessonId, ContentType type, String title, ContentStatus status) {
    this.id = id;
    this.courseId = courseId;
    this.lessonId = lessonId;
    this.type = type;
    this.title = title;
    this.status = status;
  }

  public UUID getId() {
    return id;
  }

  public ContentType getType() {
    return type;
  }

  public ContentMetadata getMetadata() {
    return metadata;
  }

  public List<ContentVersion> getVersions() {
    return versions;
  }

  public void setStatus(ContentStatus status) {
    this.status = status;
  }
}
