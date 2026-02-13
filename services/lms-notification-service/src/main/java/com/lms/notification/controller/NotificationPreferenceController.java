package com.lms.notification.controller;

import com.lms.notification.model.NotificationPreference;
import com.lms.notification.service.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notification-preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

  private static final String HEADER_USER_ID = "X-User-Id";

  private final NotificationPreferenceService service;

  @GetMapping
  public List<NotificationPreference> listPreferences(@RequestHeader(HEADER_USER_ID) String userIdHeader) {
    return service.getPreferences(UUID.fromString(userIdHeader));
  }

  @PostMapping
  public NotificationPreference upsertPreference(
      @RequestHeader(HEADER_USER_ID) String userIdHeader,
      @RequestBody NotificationPreference request) {
    return service.upsertPreference(UUID.fromString(userIdHeader), request);
  }
}
