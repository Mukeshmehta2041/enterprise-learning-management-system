export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ENROLLMENT' | 'ASSIGNMENT_GRADED' | 'PAYMENT_SUCCESS';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
}
