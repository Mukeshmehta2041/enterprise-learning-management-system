package com.lms.content.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import jakarta.annotation.PostConstruct;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3StorageService implements StorageService {

  private final S3Presigner s3Presigner;
  private final S3Client s3Client;

  @Value("${lms.storage.bucket}")
  private String bucket;

  @Value("${lms.storage.endpoint}")
  private String endpoint;

  @Value("${lms.storage.public-endpoint}")
  private String publicEndpoint;

  @PostConstruct
  public void init() {
    try {
      s3Client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
    } catch (S3Exception e) {
      if (e.statusCode() == 404) {
        s3Client.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
      } else {
        throw e;
      }
    }
  }

  @Override
  public URL generatePresignedUploadUrl(String path, String contentType, Duration expiration) {
    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
        .bucket(bucket)
        .key(path)
        .contentType(contentType)
        .build();

    PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
        .signatureDuration(expiration)
        .putObjectRequest(putObjectRequest)
        .build();

    URL url = s3Presigner.presignPutObject(presignRequest).url();
    log.debug("Generated presigned upload URL: {}", url);
    return url;
  }

  @Override
  public URL generatePresignedDownloadUrl(String path, Duration expiration) {
    String key = resolveKey(path);
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();

    GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
        .signatureDuration(expiration)
        .getObjectRequest(getObjectRequest)
        .build();

    URL url = s3Presigner.presignGetObject(presignRequest).url();
    log.debug("Generated presigned download URL for key {}: {}", key, url);
    return url;
  }

  @Override
  public void deleteObject(String path) {
    String key = resolveKey(path);
    DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();
    s3Client.deleteObject(deleteObjectRequest);
  }

  private String resolveKey(String path) {
    if (path == null)
      return null;
    String key = path;
    // Iteratively remove leading slashes and bucket names to handle any redundancy
    while (true) {
      if (key.startsWith("/")) {
        key = key.substring(1);
      } else if (key.startsWith(bucket + "/")) {
        key = key.substring(bucket.length() + 1);
      } else {
        break;
      }
    }
    return key;
  }
}
