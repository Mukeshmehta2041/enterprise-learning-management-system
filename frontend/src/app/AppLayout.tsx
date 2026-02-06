import { useState, type PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'
import { IconButton } from '@/shared/ui'
import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import { Link } from 'react-router-dom'
import { useNotifications } from '@/features/notifications/api/notificationHooks'

export function AppLayout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user } = useAuth()
  const { data: notifications } = useNotifications()

  const unreadCount = notifications?.filter(n => !n.read).length || 0

  const displayName = user?.displayName || user?.firstName || user?.email?.split('@')[0] || 'Guest'
  const userInitials = user
    ? (user.displayName ? user.displayName.split(' ').map(n => n[0]).join('') :
      user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` :
        user.email[0]).toUpperCase().substring(0, 2)
    : '??'

  return (
    <div className="flex h-screen bg-slate-50">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside id="primary-sidebar" className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
          <div className="flex items-center gap-4">
            <IconButton
              icon={<Menu className="h-5 w-5" />}
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden"
              variant="ghost"
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="primary-sidebar"
            />
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                aria-label="Search courses"
                className="h-9 w-64 rounded-full border-0 bg-slate-100 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative inline-flex items-center justify-center rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-2 px-2 py-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                {userInitials}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden lg:block">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

