package com.lms.course.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "courses", schema = "lms_course")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

  @Id
  @Column(name = "id", updatable = false, nullable = false)
  private UUID id;

  @Column(name = "title", nullable = false, length = 255)
  private String title;

  @Column(name = "slug", nullable = false, unique = true, length = 255)
  private String slug;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "thumbnail_url", length = 512)
  private String thumbnailUrl;

  @Column(name = "category", length = 100)
  private String category;

  @Column(name = "level", length = 50)
  private String level;

  @Column(name = "price", precision = 10, scale = 2)
  private BigDecimal price = BigDecimal.ZERO;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 50)
  private CourseStatus status = CourseStatus.DRAFT;

  @Column(name = "is_featured", nullable = false)
  private boolean isFeatured = false;

  @Column(name = "is_trending", nullable = false)
  private boolean isTrending = false;

  @Column(name = "completion_threshold", precision = 5, scale = 2)
  private BigDecimal completionThreshold = new BigDecimal("100.00");

  @Column(name = "require_all_assignments", nullable = false)
  private boolean requireAllAssignments = false;

  @Column(name = "currency", length = 3)
  private String currency = "USD";

  @Column(name = "is_free", nullable = false)
  private boolean isFree = false;

  @ElementCollection
  @CollectionTable(name = "course_tags", schema = "lms_course", joinColumns = @JoinColumn(name = "course_id"))
  @Column(name = "tag")
  private Set<String> tags = new HashSet<>();

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder ASC")
  private List<CourseModule> modules = new ArrayList<>();

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseInstructor> instructors = new ArrayList<>();

  public Course(UUID id, String title, String slug, String description, CourseStatus status) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.status = status != null ? status : CourseStatus.DRAFT;
  }

  public UUID getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getLevel() {
    return level;
  }

  public void setLevel(String level) {
    this.level = level;
  }

  public java.math.BigDecimal getPrice() {
    return price;
  }

  public void setPrice(java.math.BigDecimal price) {
    this.price = price;
  }

  public CourseStatus getStatus() {
    return status;
  }

  public void setStatus(CourseStatus status) {
    this.status = status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public List<CourseModule> getModules() {
    return modules;
  }

  public List<CourseInstructor> getInstructors() {
    return instructors;
  }

  public void addInstructor(CourseInstructor instructor) {
    instructors.add(instructor);
  }

  public void addModule(CourseModule module) {
    modules.add(module);
    module.setCourse(this);
  }
}
