package com.lms.gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

  @GetMapping("/course")
  public Mono<Map<String, Object>> courseFallback() {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "error");
    response.put("message", "Course service is currently unavailable. Please try again later.");
    return Mono.just(response);
  }
}
