package com.lms.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class MediaException extends RuntimeException {
  private final MediaErrorCode errorCode;

  public MediaException(MediaErrorCode errorCode) {
    super(errorCode.getDefaultMessage());
    this.errorCode = errorCode;
  }

  public MediaException(MediaErrorCode errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }

  public MediaException(MediaErrorCode errorCode, String message, Throwable cause) {
    super(message, cause);
    this.errorCode = errorCode;
  }

  public MediaErrorCode getErrorCode() {
    return errorCode;
  }
}
