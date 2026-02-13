package com.lms.notification.service;

import com.lms.notification.model.NotificationPreference;
import com.lms.notification.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

  private final NotificationPreferenceRepository repository;

  public List<NotificationPreference> getPreferences(UUID userId) {
    return repository.findByUserId(userId);
  }

  public NotificationPreference upsertPreference(UUID userId, NotificationPreference request) {
    NotificationPreference existing = repository.findByUserIdAndCourseIdAndEventTypeAndChannel(
        userId,
        request.getCourseId(),
        request.getEventType(),
        request.getChannel()).orElse(null);

    if (existing != null) {
      existing.setEnabled(request.isEnabled());
      existing.setUpdatedAt(Instant.now());
      return repository.save(existing);
    }

    NotificationPreference pref = NotificationPreference.builder()
        .id(UUID.randomUUID())
        .userId(userId)
        .courseId(request.getCourseId())
        .eventType(request.getEventType())
        .channel(request.getChannel())
        .enabled(request.isEnabled())
        .updatedAt(Instant.now())
        .build();

    return repository.save(pref);
  }

  public boolean isEnabled(UUID userId, UUID courseId, String eventType,
      NotificationPreference.NotificationChannel channel) {
    if (courseId != null) {
      var coursePref = repository.findByUserIdAndCourseIdAndEventTypeAndChannel(
          userId, courseId, eventType, channel);
      if (coursePref.isPresent()) {
        return coursePref.get().isEnabled();
      }
    }

    var globalPref = repository.findByUserIdAndCourseIdIsNullAndEventTypeAndChannel(
        userId, eventType, channel);
    return globalPref.map(NotificationPreference::isEnabled).orElse(true);
  }
}
