package com.lms.course.api;

import com.lms.course.application.CourseApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(CourseApplicationService.CourseNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleCourseNotFound(
      CourseApplicationService.CourseNotFoundException ex) {
    log.warn("Course not found: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(CourseApplicationService.ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFound(
      CourseApplicationService.ResourceNotFoundException ex) {
    log.warn("Resource not found: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(CourseApplicationService.ForbiddenException.class)
  public ResponseEntity<ErrorResponse> handleForbidden(
      CourseApplicationService.ForbiddenException ex) {
    log.warn("Forbidden: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.FORBIDDEN.value(),
        "Forbidden",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
  }

  @ExceptionHandler(CourseApplicationService.ConflictException.class)
  public ResponseEntity<ErrorResponse> handleConflict(
      CourseApplicationService.ConflictException ex) {
    log.warn("Conflict: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.CONFLICT.value(),
        "Conflict",
        ex.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
    log.warn("Illegal argument: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage());
    return ResponseEntity.badRequest().body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(FieldError::getDefaultMessage)
        .collect(Collectors.joining(", "));

    ErrorResponse error = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        message);
    return ResponseEntity.badRequest().body(error);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
    log.error("Unexpected error", ex);
    ErrorResponse error = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error",
        "An unexpected error occurred");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
