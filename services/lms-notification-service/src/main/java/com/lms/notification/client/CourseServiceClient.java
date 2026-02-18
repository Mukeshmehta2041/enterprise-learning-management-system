package com.lms.notification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "lms-course-service", url = "${lms.course-service.url:http://lms-course-service:8083}")
public interface CourseServiceClient {

  @GetMapping("/api/v1/courses/{id}")
  CourseResponse getCourse(@PathVariable("id") UUID id);

  record CourseResponse(UUID id, String title) {
  }
}
