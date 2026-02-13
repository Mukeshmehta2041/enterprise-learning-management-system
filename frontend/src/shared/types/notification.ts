import { z } from 'zod'

export const NotificationTypeSchema = z.enum([
  'INFO',
  'SUCCESS',
  'WARNING',
  'ERROR',
  'ENROLLMENT',
  'ASSIGNMENT_CREATED',
  'ASSIGNMENT_UPDATED',
  'ASSIGNMENT_DUE_SOON',
  'ASSIGNMENT_GRADED',
  'LESSON_PUBLISHED',
  'LESSON_UPDATED',
  'PAYMENT_SUCCESS',
]);

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: NotificationTypeSchema,
  read: z.boolean(),
  createdAt: z.string(),
  link: z.string().optional(),
})

export type Notification = z.infer<typeof NotificationSchema>;

export const MarkAsReadRequestSchema = z.object({
  notificationIds: z.array(z.string()),
})

export type MarkAsReadRequest = z.infer<typeof MarkAsReadRequestSchema>;

export const NotificationChannelSchema = z.enum(['IN_APP', 'EMAIL', 'PUSH']);

export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationEventTypeSchema = z.enum([
  'LessonPublished',
  'LessonUpdated',
  'AssignmentCreated',
  'AssignmentGraded',
  'AssignmentUpdated',
  'AssignmentDueSoon'
]);

export type NotificationEventType = z.infer<typeof NotificationEventTypeSchema>;

export const NotificationPreferenceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string().nullable().optional(),
  eventType: NotificationEventTypeSchema,
  channel: NotificationChannelSchema,
  enabled: z.boolean(),
  updatedAt: z.string(),
});

export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>;

export const NotificationPreferenceUpsertSchema = z.object({
  courseId: z.string().nullable().optional(),
  eventType: NotificationEventTypeSchema,
  channel: NotificationChannelSchema,
  enabled: z.boolean(),
});

export type NotificationPreferenceUpsert = z.infer<typeof NotificationPreferenceUpsertSchema>;
