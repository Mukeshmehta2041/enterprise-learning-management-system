package com.lms.common.exception;

public enum MediaErrorCode {
  UPLOAD_FAILED("MEDIA_001", "Upload failed"),
  FILE_TOO_LARGE("MEDIA_002", "File size exceeds limit"),
  INVALID_FILE_TYPE("MEDIA_003", "Unsupported file type"),
  PROCESSING_FAILED("MEDIA_004", "Content processing failed"),
  STORAGE_UNAVAILABLE("MEDIA_005", "Storage service is temporarily unavailable"),
  CONTENT_NOT_FOUND("MEDIA_006", "Content record not found");

  private final String code;
  private final String defaultMessage;

  MediaErrorCode(String code, String defaultMessage) {
    this.code = code;
    this.defaultMessage = defaultMessage;
  }

  public String getCode() {
    return code;
  }

  public String getDefaultMessage() {
    return defaultMessage;
  }
}
