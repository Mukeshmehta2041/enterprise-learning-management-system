import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  FileText,
  Settings,
  CreditCard,
  X,
  LogOut,
  GraduationCap,
  type LucideIcon
} from 'lucide-react'
import { IconButton } from '@/shared/ui'
import { useAuth } from '@/shared/context/AuthContext'
import { useAccess, type Role } from '@/shared/hooks/useAccess'
import { useTenant } from '@/shared/context/TenantContext'

const navItems: Array<{ name: string; href: string; icon: LucideIcon; roles?: Role[] }> = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['INSTRUCTOR', 'ADMIN']
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['INSTRUCTOR', 'ADMIN']
  },
  { name: 'Subscription', href: '/pricing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
  className?: string
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { hasRole } = useAccess()
  const { tenant } = useTenant()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const fullName = user
    ? user.displayName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email)
    : 'Guest'

  const userInitials = user
    ? (user.displayName ? user.displayName.split(' ').map(n => n[0]).join('') :
      user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` :
        user.email[0]).toUpperCase().substring(0, 2)
    : '??'

  const roleNames = user?.roles.join(', ') || 'User'

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-white border-r border-slate-200',
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {tenant?.branding.logoUrl ? (
            <img src={tenant.branding.logoUrl} alt="" className="h-8 w-8" />
          ) : (
            <GraduationCap className="h-8 w-8 text-primary" />
          )}
          <span className="truncate">{tenant?.branding.institutionName || 'LMS Platform'}</span>
        </Link>
        {onClose && (
          <IconButton
            icon={<X className="h-5 w-5" />}
            onClick={onClose}
            variant="ghost"
            className="md:hidden"
            aria-label="Close navigation"
          />
        )}
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4" aria-label="Primary">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-slate-500',
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-3 px-2 py-3 rounded-md bg-slate-50">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {fullName}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">{roleNames}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  )
}
