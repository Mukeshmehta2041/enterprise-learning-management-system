package com.lms.course.infrastructure;

import com.lms.common.events.EventEnvelope;
import com.lms.course.domain.Course;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

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

  public void publishModuleDeleted(String courseId, String moduleId) {
    EventEnvelope event = EventEnvelope.of("ModuleDeleted", moduleId,
        Map.of("courseId", courseId, "moduleId", moduleId), null);
    kafkaTemplate.send(TOPIC, courseId, event);
  }

  public void publishLessonDeleted(String courseId, String lessonId) {
    EventEnvelope event = EventEnvelope.of("LessonDeleted", lessonId,
        Map.of("courseId", courseId, "lessonId", lessonId), null);
    kafkaTemplate.send(TOPIC, courseId, event);
  }

  public void publishLessonPublished(UUID courseId, UUID lessonId, String title) {
    EventEnvelope event = EventEnvelope.of(
        "LessonPublished",
        lessonId.toString(),
        Map.of(
            "courseId", courseId,
            "lessonId", lessonId,
            "title", title),
        null);
    kafkaTemplate.send(TOPIC, courseId.toString(), event);
    log.info("Published LessonPublished event for lesson: {}", lessonId);
  }

  public void publishLessonUpdated(UUID courseId, UUID lessonId, String title) {
    EventEnvelope event = EventEnvelope.of(
        "LessonUpdated",
        lessonId.toString(),
        Map.of(
            "courseId", courseId,
            "lessonId", lessonId,
            "title", title),
        null);
    kafkaTemplate.send(TOPIC, courseId.toString(), event);
    log.info("Published LessonUpdated event for lesson: {}", lessonId);
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
