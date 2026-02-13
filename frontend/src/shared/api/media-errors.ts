import type { AppError } from '@/shared/types/error'

const MEDIA_ERROR_MESSAGES: Record<string, { message: string; retryable: boolean }> = {
  MEDIA_001: { message: 'Upload failed. Please try again.', retryable: true },
  MEDIA_002: { message: 'File too large. Please upload a smaller file.', retryable: false },
  MEDIA_003: { message: 'Unsupported file type. Please upload a video or PDF.', retryable: false },
  MEDIA_004: { message: 'Processing failed. Try uploading again.', retryable: true },
  MEDIA_005: { message: 'Storage service is temporarily unavailable. Try again soon.', retryable: true },
  MEDIA_006: { message: 'Content record not found. Please refresh and try again.', retryable: false },
}

export function getMediaErrorMessage(error: unknown): { message: string; retryable: boolean } {
  const appError = error as AppError | undefined
  const code = appError?.code

  if (code && MEDIA_ERROR_MESSAGES[code]) {
    return MEDIA_ERROR_MESSAGES[code]
  }

  if (appError?.status === 413) {
    return { message: 'File too large. Please upload a smaller file.', retryable: false }
  }

  if (appError?.message) {
    return { message: appError.message, retryable: appError.status ? appError.status >= 500 : true }
  }

  return { message: 'Something went wrong. Please try again.', retryable: true }
}
