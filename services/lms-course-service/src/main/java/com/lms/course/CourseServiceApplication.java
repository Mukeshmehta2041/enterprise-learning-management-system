package com.lms.course;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@OpenAPIDefinition(info = @Info(title = "LMS Course Service", version = "v1", description = "Course and Module Management Service"))
public class CourseServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(CourseServiceApplication.class, args);
  }
}
