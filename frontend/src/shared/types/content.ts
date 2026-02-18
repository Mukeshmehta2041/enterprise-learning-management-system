import { z } from 'zod'

export const QuizQuestionSchema = z.object({
  id: z.string(),
  questionText: z.string(),
  options: z.record(z.string(), z.string()), // ID to Text
  correctOptionId: z.string(),
  sortOrder: z.number(),
})

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>

export const ContentResponseSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  type: z.enum(['VIDEO', 'PDF', 'QUIZ', 'IMAGE', 'DOCUMENT']), // Added PDF, IMAGE, kept DOCUMENT for compatibility
  title: z.string(),
  status: z.string(),
  metadata: z.object({
    durationSecs: z.number().nullable().optional(),
    sizeBytes: z.number().nullable().optional(),
    mimeType: z.string().nullable().optional(),
  }).nullable().optional(),
  questions: z.array(QuizQuestionSchema).nullable().optional(),
})

export type ContentResponse = z.infer<typeof ContentResponseSchema>

export const PlaybackTokenResponseSchema = z.object({
  playbackUrl: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  renditions: z.array(z.object({
    resolution: z.string(),
    url: z.string(),
    bitrate: z.number().nullable().optional()
  })).nullable().optional(),
  captions: z.array(z.object({
    languageCode: z.string(),
    url: z.string(),
    label: z.string()
  })).nullable().optional()
})

export type PlaybackTokenResponse = z.infer<typeof PlaybackTokenResponseSchema>
