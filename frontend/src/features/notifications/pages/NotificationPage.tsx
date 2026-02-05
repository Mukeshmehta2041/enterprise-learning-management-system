import { useNotifications, useMarkAsRead } from '../api/notificationHooks';
import { Card, PageHeader, Container } from '@/shared/ui/Layout';
import { Button } from '@/shared/ui';
import { Bell, Check, Info, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Heading4, TextMuted, TextSmall } from '@/shared/ui/Typography';
import { cn } from '@/shared/utils/cn';
import type { NotificationType } from '@/shared/types/notification';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'SUCCESS':
    case 'PAYMENT_SUCCESS':
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case 'WARNING':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'ERROR':
      return <XCircle className="h-5 w-5 text-rose-500" />;
    case 'INFO':
    case 'ENROLLMENT':
    case 'ASSIGNMENT_GRADED':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export function NotificationPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleMarkAllAsRead = () => {
    if (!notifications) return;
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      markAsRead.mutate({ notificationIds: unreadIds });
    }
  };

  const handleMarkOneAsRead = (id: string) => {
    markAsRead.mutate({ notificationIds: [id] });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading notifications...</div>;
  }

  return (
    <Container>
      <PageHeader
        title="Notifications"
        description="Stay updated with your learning journey."
        actions={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAsRead.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )
        }
      />

      <div className="space-y-4">
        {!notifications || notifications.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <Heading4>No notifications yet</Heading4>
              <TextMuted>We'll notify you when something important happens.</TextMuted>
            </div>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors",
                !notification.read && "border-l-4 border-l-indigo-500 bg-indigo-50/30"
              )}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-2">
                    <Heading4 className="text-base m-0">{notification.title}</Heading4>
                    <div className="flex items-center text-slate-400 gap-1">
                      <Clock className="h-3 w-3" />
                      <TextSmall>{new Date(notification.createdAt).toLocaleDateString()}</TextSmall>
                    </div>
                  </div>
                  <TextMuted className="mt-1 text-sm">{notification.message}</TextMuted>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 px-2 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      onClick={() => handleMarkOneAsRead(notification.id)}
                      disabled={markAsRead.isPending}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}
