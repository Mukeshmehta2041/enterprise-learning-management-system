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
  type: z.enum(['VIDEO', 'DOCUMENT', 'QUIZ']),
  title: z.string(),
  status: z.string(),
  metadata: z.object({
    durationSecs: z.number().optional(),
    sizeBytes: z.number().optional(),
    mimeType: z.string().optional(),
  }).nullable().optional(),
  questions: z.array(QuizQuestionSchema).nullable().optional(),
})

export type ContentResponse = z.infer<typeof ContentResponseSchema>

export const PlaybackTokenResponseSchema = z.object({
  playbackUrl: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  renditions: z.array(z.object({
    quality: z.string(),
    url: z.string()
  })).optional(),
  captions: z.array(z.object({
    language: z.string(),
    url: z.string(),
    label: z.string()
  })).optional()
})

export type PlaybackTokenResponse = z.infer<typeof PlaybackTokenResponseSchema>
