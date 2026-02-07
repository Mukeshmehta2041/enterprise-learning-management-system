import { Sidebar } from './Sidebar'
import { IconButton, Breadcrumbs } from '@/shared/ui'
import { Menu, Search, GraduationCap } from 'lucide-react'
import { useAuth } from '@/shared/context/AuthContext'
import { useUI } from '@/shared/context/UIContext'
import { useTenant } from '@/shared/context/TenantContext'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown'
import { NetworkStatusIndicator } from '@/shared/components/NetworkStatusIndicator'
import { PWAInstallBanner } from '@/shared/components/PWAInstallBanner'

export function AppLayout() {
  const { isSidebarOpen, setSidebarOpen, toggleSidebar } = useUI()
  const { user } = useAuth()
  const { tenant } = useTenant()
  const location = useLocation()

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/analytics'

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest'
  const userInitials = (user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('')
    : user?.email[0] || '?'
  ).toUpperCase().substring(0, 2)

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <NetworkStatusIndicator />
      <PWAInstallBanner />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside id="primary-sidebar" className={`
        fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
          <div className="flex items-center gap-4">
            <IconButton
              icon={<Menu className="h-5 w-5" />}
              onClick={() => toggleSidebar()}
              className="md:hidden"
              variant="ghost"
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="primary-sidebar"
            />

            {/* Mobile Branding */}
            <Link to="/" className="flex items-center gap-2 md:hidden">
              {tenant?.branding?.logoUrl ? (
                <img src={tenant.branding.logoUrl} alt="" className="h-6 w-6" />
              ) : (
                <GraduationCap className="h-6 w-6 text-primary" />
              )}
              <span className="text-sm font-bold truncate max-w-30">
                {tenant?.branding?.institutionName}
              </span>
            </Link>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                aria-label="Search courses"
                className="h-9 w-64 rounded-full border-0 bg-slate-100 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <div className="h-4 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-2 px-2 py-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {userInitials}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden lg:block">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="mx-auto w-full">
            {!isDashboard && <Breadcrumbs />}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

