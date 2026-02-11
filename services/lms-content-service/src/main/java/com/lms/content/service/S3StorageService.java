package com.lms.content.service;

import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class S3StorageService implements StorageService {

  private final S3Presigner s3Presigner;
  private final S3Client s3Client;

  @Value("${lms.storage.bucket}")
  private String bucket;

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

    return s3Presigner.presignPutObject(presignRequest).url();
  }

  @Override
  public URL generatePresignedDownloadUrl(String path, Duration expiration) {
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
        .bucket(bucket)
        .key(path)
        .build();

    GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
        .signatureDuration(expiration)
        .getObjectRequest(getObjectRequest)
        .build();

    return s3Presigner.presignGetObject(presignRequest).url();
  }

  @Override
  public void deleteObject(String path) {
    DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
        .bucket(bucket)
        .key(path)
        .build();
    s3Client.deleteObject(deleteObjectRequest);
  }
}
