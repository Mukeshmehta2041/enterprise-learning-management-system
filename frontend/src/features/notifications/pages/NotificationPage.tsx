import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkAsRead } from '../api/notificationHooks';
import { Card, PageHeader, Container, Button, Heading4, EmptyState, SearchInput, FilterGroup } from '@/shared/ui';
import { Bell, Check, Info, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
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
    case 'ASSIGNMENT_CREATED':
    case 'ASSIGNMENT_UPDATED':
    case 'ASSIGNMENT_DUE_SOON':
    case 'ASSIGNMENT_GRADED':
    case 'LESSON_PUBLISHED':
    case 'LESSON_UPDATED':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export function NotificationPage() {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'course'>('all');

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    return notifications.filter(n => {
      const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchFilter =
        filter === 'all' ? true :
          filter === 'unread' ? !n.read :
            filter === 'system' ? ['INFO', 'SUCCESS', 'WARNING', 'ERROR'].includes(n.type) :
              filter === 'course' ? ['ENROLLMENT', 'ASSIGNMENT_CREATED', 'ASSIGNMENT_GRADED', 'LESSON_PUBLISHED'].includes(n.type) :
                true;

      return matchSearch && matchFilter;
    });
  }, [notifications, searchQuery, filter]);

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleMarkAllAsRead = () => {
    if (!notifications) return;
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      markAsRead.mutate({ notificationIds: unreadIds });
    }
  };

  const handleMarkOneAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead.mutate({ notificationIds: [id] });
  };

  if (isLoading) {
    return (
      <Container>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
      </Container>
    );
  }

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: `Unread (${unreadCount})`, value: 'unread' },
    { label: 'System', value: 'system' },
    { label: 'Courses', value: 'course' },
  ];

  return (
    <Container className="pb-12">
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

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="w-full sm:w-72">
            <SearchInput
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
            />
          </div>
          <FilterGroup
            options={filterOptions}
            selected={filter}
            onSelect={(val) => setFilter(val as 'all' | 'unread' | 'system' | 'course')}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <EmptyState
            title={searchQuery || filter !== 'all' ? "No results found" : "No notifications yet"}
            description={searchQuery || filter !== 'all'
              ? "Try adjusting your filters or search terms."
              : "We'll notify you when something important happens, like new course content or assignment grades."}
            icon={Bell}
            action={searchQuery || filter !== 'all' ? (
              <Button variant="ghost" onClick={() => { setSearchQuery(''); setFilter('all'); }}>
                Clear filters
              </Button>
            ) : undefined}
          />
        ) : (
          <div className="grid gap-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "p-0 overflow-hidden transition-all hover:shadow-md border-slate-200",
                  !notification.read && "border-l-4 border-l-indigo-500 bg-indigo-50/30"
                )}
              >
                <div className="flex items-start p-4 gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Heading4 className={cn(
                        "text-base m-0",
                        !notification.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                      )}>
                        {notification.title}
                      </Heading4>
                      <div className="flex items-center text-slate-400 gap-1.5 whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {new Date(notification.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className={cn(
                      "mt-1 text-sm leading-relaxed",
                      !notification.read ? "text-slate-800" : "text-slate-500"
                    )}>
                      {notification.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="xs"
                            color="primary"
                            onClick={() => navigate(notification.link!)}
                          >
                            View Details
                          </Button>
                        )}
                      </div>

                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkOneAsRead(notification.id, e)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline-offset-4 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

