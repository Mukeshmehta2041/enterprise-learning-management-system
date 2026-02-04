package com.lms.content.repository;

import com.lms.content.domain.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContentItemRepository extends JpaRepository<ContentItem, UUID> {
    List<ContentItem> findByCourseId(UUID courseId);
    List<ContentItem> findByLessonId(UUID lessonId);
}
