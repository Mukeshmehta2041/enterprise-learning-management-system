package com.lms.notification.repository;

import com.lms.notification.model.NotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, UUID> {
  List<NotificationPreference> findByUserId(UUID userId);

  Optional<NotificationPreference> findByUserIdAndCourseIdAndEventTypeAndChannel(
      UUID userId, UUID courseId, String eventType, NotificationPreference.NotificationChannel channel);

  Optional<NotificationPreference> findByUserIdAndCourseIdIsNullAndEventTypeAndChannel(
      UUID userId, String eventType, NotificationPreference.NotificationChannel channel);
}
