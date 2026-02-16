import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Clock, Info, CheckCircle2, AlertTriangle, XCircle, Check } from 'lucide-react';
import { useMarkAsRead } from '../api/notificationHooks';
import { useNotificationContext } from '../context/NotificationContext';
import { IconButton, TextSmall, TextMuted, Heading4 } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import type { NotificationType } from '@/shared/types/notification';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'SUCCESS':
    case 'PAYMENT_SUCCESS':
    case 'PAYMENT':
    case 'ENROLLMENT':
    case 'USER_WELCOME':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'WARNING':
    case 'ASSIGNMENT_DUE_SOON':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'ERROR':
      return <XCircle className="h-4 w-4 text-rose-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount } = useNotificationContext();
  const markAsRead = useMarkAsRead();

  const recentNotifications = notifications?.slice(0, 5) || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notifications) return;
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      markAsRead.mutate({ notificationIds: unreadIds });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton
        icon={
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        }
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        aria-label="Notifications"
        aria-expanded={isOpen}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50/50">
              <Heading4 className="text-sm font-semibold m-0">Notifications</Heading4>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {recentNotifications.length > 0 ? (
                <div className="divide-y">
                  {recentNotifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to="/notifications"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm leading-tight",
                          !notification.read ? "font-semibold text-slate-900" : "text-slate-700"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-slate-400">
                          <Clock className="h-3 w-3" />
                          <TextSmall className="text-[10px]">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </TextSmall>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="mt-2 flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-4 text-center">
                  <Bell className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <TextMuted className="text-sm">No new notifications</TextMuted>
                </div>
              )}
            </div>

            <div className="border-t">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
