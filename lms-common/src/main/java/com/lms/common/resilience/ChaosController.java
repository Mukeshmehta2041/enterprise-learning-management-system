package com.lms.common.resilience;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chaos")
@ConditionalOnProperty(name = "lms.chaos.enabled", havingValue = "true")
public class ChaosController {

  @PostMapping("/latency")
  public void setLatency(@RequestParam long millis) {
    ChaosFilter.setLatency(millis);
  }

  @PostMapping("/error")
  public void setError(@RequestParam int code) {
    ChaosFilter.setErrorCode(code);
  }

  @PostMapping("/reset")
  public void reset() {
    ChaosFilter.reset();
  }
}
