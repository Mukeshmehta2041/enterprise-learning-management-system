import { useState } from 'react';
import { apiClient } from '../api/client';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MobileAppError, mapErrorToMobileError } from '../utils/errors';
import { mapMediaErrorMessage } from '../utils/mediaErrors';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (contentId: string, fileUri: string, fileName: string, mimeType: string) => {
    try {
      setIsUploading(true);
      setProgress(0);

      // 1. Get presigned URL
      const { data: { uploadUrl } } = await apiClient.post(`/content/${contentId}/upload-url`, {
        fileName,
        contentType: mimeType,
      });

      // 2. Upload to S3/Storage
      // On mobile, we need to fetch the file content from the URI
      const response = await fetch(fileUri);
      const blob = await response.blob();

      await axios.put(uploadUrl, blob, {
        headers: {
          'Content-Type': mimeType,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
      });

      // 3. Complete upload
      await apiClient.post(`/content/${contentId}/complete-upload`, {
        storagePath: new URL(uploadUrl).pathname.substring(1),
      });

      return { success: true };
    } catch (error) {
      const normalized = error instanceof MobileAppError ? error : mapErrorToMobileError(error);
      const { message, retryable } = mapMediaErrorMessage(normalized);
      console.warn('mobile.telemetry', {
        feature: 'course-media',
        action: 'upload',
        contentId,
        code: normalized.code,
        status: normalized.status,
      });
      throw new MobileAppError(message, normalized.code, normalized.status, retryable, normalized.fieldErrors);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const pickAndUpload = async (contentId: string, type: 'VIDEO' | 'DOCUMENT') => {
    if (type === 'VIDEO') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return uploadFile(
          contentId,
          asset.uri,
          asset.fileName || `video_${Date.now()}.mp4`,
          asset.mimeType || 'video/mp4'
        );
      }
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return uploadFile(
          contentId,
          asset.uri,
          asset.name,
          asset.mimeType || 'application/octet-stream'
        );
      }
    }
    return null;
  };

  return {
    uploadFile,
    pickAndUpload,
    isUploading,
    progress,
  };
}
