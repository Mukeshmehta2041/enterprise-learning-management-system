import { z } from 'zod'

export const NotificationTypeSchema = z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ENROLLMENT', 'ASSIGNMENT_GRADED', 'PAYMENT_SUCCESS']);

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
