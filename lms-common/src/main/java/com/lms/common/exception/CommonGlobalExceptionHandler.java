package com.lms.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class CommonGlobalExceptionHandler {

  @ExceptionHandler(MediaException.class)
  public ResponseEntity<ErrorResponse> handleMediaException(MediaException ex) {
    log.error("Media error: {} - Code: {}", ex.getMessage(), ex.getErrorCode().getCode());

    HttpStatus status = switch (ex.getErrorCode()) {
      case FILE_TOO_LARGE, INVALID_FILE_TYPE -> HttpStatus.BAD_REQUEST;
      case CONTENT_NOT_FOUND -> HttpStatus.NOT_FOUND;
      default -> HttpStatus.INTERNAL_SERVER_ERROR;
    };

    ErrorResponse error = ErrorResponse.builder()
        .status(status.value())
        .error("Media Error")
        .message(ex.getMessage())
        .code(ex.getErrorCode().getCode())
        .build();
    return ResponseEntity.status(status).body(error);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
    log.warn("Resource not found: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex) {
    log.warn("Forbidden: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.FORBIDDEN.value(),
        "Forbidden",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
    log.warn("Bad Request: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(err -> err.getField() + ": " + err.getDefaultMessage())
        .collect(Collectors.joining(", "));
    ErrorResponse error = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Validation Error",
        message);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }
}
