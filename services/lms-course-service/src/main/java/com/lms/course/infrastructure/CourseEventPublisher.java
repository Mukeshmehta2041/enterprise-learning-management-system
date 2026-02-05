package com.lms.course.infrastructure;

import com.lms.common.events.EventEnvelope;
import com.lms.course.domain.Course;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CourseEventPublisher {
  private static final Logger log = LoggerFactory.getLogger(CourseEventPublisher.class);
  private final KafkaTemplate<String, Object> kafkaTemplate;
  private static final String TOPIC = "course.events";

  public void publishCourseCreated(Course course) {
    publish(course, "CourseCreated");
  }

  public void publishCourseUpdated(Course course) {
    publish(course, "CourseUpdated");
  }

  public void publishCourseDeleted(String courseId) {
    EventEnvelope event = EventEnvelope.of("CourseDeleted", courseId, Map.of("id", courseId), null);
    kafkaTemplate.send(TOPIC, courseId, event);
  }

  private void publish(Course course, String eventType) {
    EventEnvelope event = EventEnvelope.of(
        eventType,
        course.getId().toString(),
        Map.of(
            "id", course.getId(),
            "title", course.getTitle(),
            "description", course.getDescription() != null ? course.getDescription() : "",
            "status", course.getStatus().name(),
            "slug", course.getSlug()),
        null);
    kafkaTemplate.send(TOPIC, course.getId().toString(), event);
    log.info("Published {} event for course: {}", eventType, course.getId());
  }
}
