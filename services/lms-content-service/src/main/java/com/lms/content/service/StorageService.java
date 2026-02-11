package com.lms.content.service;

import java.net.URL;
import java.time.Duration;

public interface StorageService {
  URL generatePresignedUploadUrl(String path, String contentType, Duration expiration);

  URL generatePresignedDownloadUrl(String path, Duration expiration);

  void deleteObject(String path);
}
