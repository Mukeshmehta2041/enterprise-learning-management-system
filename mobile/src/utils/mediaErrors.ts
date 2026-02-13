import { MobileAppError } from './errors'

const MEDIA_ERROR_MESSAGES: Record<string, { message: string; retryable: boolean }> = {
  MEDIA_001: { message: 'Upload failed. Please try again.', retryable: true },
  MEDIA_002: { message: 'File too large. Please upload a smaller file.', retryable: false },
  MEDIA_003: { message: 'Unsupported file type. Please choose a video or PDF.', retryable: false },
  MEDIA_004: { message: 'Processing failed. Try uploading again.', retryable: true },
  MEDIA_005: { message: 'Storage service is temporarily unavailable. Try again later.', retryable: true },
  MEDIA_006: { message: 'Content record not found. Please refresh and try again.', retryable: false },
  NETWORK_ERROR: { message: 'No connection. Check your network and retry.', retryable: true },
}

export function mapMediaErrorMessage(error: MobileAppError): { message: string; retryable: boolean } {
  if (MEDIA_ERROR_MESSAGES[error.code]) {
    return MEDIA_ERROR_MESSAGES[error.code]
  }

  if (error.status === 413) {
    return { message: 'File too large. Please upload a smaller file.', retryable: false }
  }

  return {
    message: error.message || 'Upload failed. Please try again.',
    retryable: error.isRetryable,
  }
}
