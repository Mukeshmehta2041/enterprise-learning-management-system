package com.lms.common.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
  private int status;
  private String error;
  private String message;
  private String code;
  @Builder.Default
  private LocalDateTime timestamp = LocalDateTime.now();
  private Map<String, String> details;

  public ErrorResponse(int status, String error, String message) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.timestamp = LocalDateTime.now();
  }
}
